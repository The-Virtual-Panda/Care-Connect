import { PhoneNumber } from '@/api/models/phone-number';
import { AuthService } from '@/api/services/auth.service';
import { PhoneService } from '@/api/services/phone.service';
import { PhonePipe } from '@/pipes/phone.pipe';
import { Logger } from '@/utils/logger';

import { CommonModule } from '@angular/common';
import { Component, OnInit, Signal, computed, effect, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppMenuitem } from './app.menuitem';

@Component({
    selector: '[app-menu]',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    providers: [PhonePipe],
    template: `
        <ul class="layout-menu">
            <ng-container *ngFor="let item of menuItems(); let i = index">
                @if (item.separator) {
                    <li class="menu-separator"></li>
                } @else {
                    <li app-menuitem [item]="item" [index]="i" [root]="true"></li>
                }
            </ng-container>
        </ul>
    `
})
export class AppMenu implements OnInit {
    private authService = inject(AuthService);
    private phoneService = inject(PhoneService);
    private phonePipe = inject(PhonePipe);

    private orgPhoneNumbers = signal<PhoneNumber[]>([]);

    menuItems = computed<any>(() => {
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
                        label: 'Recipients',
                        icon: 'pi pi-users',
                        routerLink: 'recipients'
                    }
                ]
            },
            { separator: true },
            {
                label: 'Phone Numbers',
                icon: 'pi pi-phone',
                visible: phoneNumbers.length > 0,
                items: phoneNumbers.map((phone) => ({
                    label: phone.label ? `${phone.label} ${this.phonePipe.transform(phone.number)}` : this.phonePipe.transform(phone.number),
                    routerLink: ['/phone-numbers', phone.id, 'config']
                }))
            }
        ];
    });

    constructor() {
        effect(() => {
            const user = this.authService.fireUser();
            const orgId = this.authService.currentOrgId();

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
