import { PhoneNumber } from '@/api/models/entity/phone-number';
import { AuthService } from '@/api/services/auth.service';
import { PhoneService } from '@/api/services/phone.service';
import { StripeService } from '@/api/services/stripe.service';
import { PhonePipe } from '@/pipes/phone.pipe';
import { AppLoadingService } from '@/services/app-loading.service';
import { OrgContextService } from '@/services/org-context.service';
import { ToastService } from '@/services/toast.service';
import { Logger } from '@/utils/logger';

import { Component, OnInit, Signal, computed, effect, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MenuItem } from 'primeng/api';

import { AppMenuitem } from './app.menuitem';

@Component({
    selector: '[app-menu]',
    standalone: true,
    imports: [AppMenuitem, RouterModule],
    providers: [PhonePipe, PhoneService, StripeService],
    template: `
        <ul class="layout-menu">
            @for (item of menuItems(); track item; let i = $index) {
                @if (item.separator) {
                    <li class="menu-separator"></li>
                } @else {
                    <li app-menuitem [item]="item" [index]="i" [root]="true"></li>
                }
            }
        </ul>
    `
})
export class AppMenu implements OnInit {
    private authService = inject(AuthService);
    private phoneService = inject(PhoneService);
    private stripeService = inject(StripeService);
    private loadingService = inject(AppLoadingService);
    private toastService = inject(ToastService);
    private phonePipe = inject(PhonePipe);
    private orgContextService = inject(OrgContextService);

    private orgPhoneNumbers = signal<PhoneNumber[]>([]);

    menuItems = computed<MenuItem[]>(() => {
        const phoneNumbers = this.orgPhoneNumbers();

        return [
            // {
            //     label: 'Home',
            //     icon: 'pi pi-home',
            //     routerLink: '/'
            // },
            // { separator: true },
            {
                label: 'Organization',
                icon: 'pi pi-building',
                items: [
                    {
                        label: 'Stripe Billing Portal',
                        icon: 'pi pi-credit-card',
                        command: () => {
                            this.loadingService.showBlockingLoader('Redirecting to Stripe...');
                            this.stripeService.getBillingPortalUrl().subscribe({
                                next: (url) => (window.location.href = url),
                                error: (err) => {
                                    Logger.error('Error creating redirect url:', err);
                                    this.loadingService.hideBlockingLoader();
                                    this.toastService.showError('Error creating redirect url', 'Could not navigate to billing portal. Please try again later.');
                                }
                            });
                        }
                    },
                    {
                        label: 'Roles & Permissions',
                        icon: 'pi pi-sitemap',
                        routerLink: this.orgContextService.link(['roles'])
                    },
                    {
                        label: 'Recipients',
                        icon: 'pi pi-users',
                        routerLink: this.orgContextService.link(['recipients'])
                    }
                ]
            },
            { separator: true },
            {
                label: 'Phone',
                icon: 'pi pi-phone',
                visible: phoneNumbers.length > 0,
                items: [
                    {
                        label: 'Call History',
                        icon: 'pi pi-history',
                        routerLink: this.orgContextService.link(['phone', 'call-history'])
                    },
                    ...phoneNumbers.map((phone) => ({
                        label: phone.label ? `${phone.label} ${this.phonePipe.transform(phone.number)}` : this.phonePipe.transform(phone.number),
                        icon: 'pi pi-mobile',
                        routerLink: this.orgContextService.link(['phone', phone.id, 'call-flow'])
                    }))
                ]
            },
            { separator: true, visible: this.authService.isSystemAdmin() },
            {
                label: 'Admin Center',
                icon: 'pi pi-shield',
                visible: this.authService.isSystemAdmin(),
                items: [
                    {
                        label: 'Organizations',
                        icon: 'pi pi-building',
                        routerLink: '/admin/organizations'
                    },
                    {
                        label: 'System Users',
                        icon: 'pi pi-users',
                        routerLink: '/admin/system-users'
                    }
                ]
            }
        ];
    });

    constructor() {
        effect(() => {
            const user = this.authService.fireUser();
            const orgId = this.orgContextService.routeOrgId();

            if (user && orgId) {
                this.phoneService.getOrgPhoneNumbers(orgId).subscribe({
                    next: (phoneNumbers) => {
                        this.orgPhoneNumbers.set(phoneNumbers);
                    },
                    error: (err) => {
                        Logger.error('Error fetching organization phone numbers:', err);
                        this.orgPhoneNumbers.set([]);
                    }
                });
            } else {
                this.orgPhoneNumbers.set([]);
            }
        });
    }

    ngOnInit() {
        const loggedIn = this.authService.isLoggedIn();
        if (!loggedIn) {
            Logger.error('Using the app menu without a logged-in user. This is not intended design.');
        }
    }
}
