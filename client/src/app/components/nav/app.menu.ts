import { PhoneNumber } from '@/api/models/phone-number';
import { AuthService } from '@/api/services/auth.service';
import { PhoneService } from '@/api/services/phone.service';
import { PhonePipe } from '@/pipes/phone.pipe';
import { Subject, combineLatest, takeUntil } from 'rxjs';

import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppMenuitem } from './app.menuitem';

@Component({
    selector: '[app-menu]',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    providers: [PhonePipe],
    template: `
        <ul class="layout-menu">
            <ng-container *ngFor="let item of menuItems; let i = index">
                <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
                <li *ngIf="item.separator" class="menu-separator"></li>
            </ng-container>
        </ul>
    `
})
export class AppMenu implements OnInit, OnDestroy {
    private authService = inject(AuthService);
    private phoneService = inject(PhoneService);
    private phonePipe = inject(PhonePipe);
    private destroy$ = new Subject<void>();

    menuItems: any[] = [];
    orgPhoneNumbers: PhoneNumber[] = [];
    currentOrgId: string | null = null;

    ngOnInit() {
        const loggedIn = this.authService.isLoggedIn();
        if (!loggedIn) {
            console.error('Using the app menu without a logged-in user. This is not intended design.');
        }

        // Subscribe to authentication state changes
        this.authService.user$.pipe(takeUntil(this.destroy$)).subscribe((user) => {
            const isLoggedIn = !!user;
            this.currentOrgId = this.authService.currentOrgId;

            if (isLoggedIn && this.currentOrgId) {
                this.phoneService
                    .getOrgPhoneNumbers(this.currentOrgId)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: (phoneNumbers) => {
                            this.orgPhoneNumbers = phoneNumbers;
                            this.updateMenuItems();
                        },
                        error: (err) => {
                            console.error('Error fetching organization phone numbers:', err);
                            this.orgPhoneNumbers = [];
                            this.updateMenuItems();
                        }
                    });
            } else {
                console.warn('User is not logged in or no org id found, clearing organization phone numbers');
                this.currentOrgId = null;
                this.updateMenuItems();
            }
        });
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private updateMenuItems() {
        this.menuItems = [
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
                visible: this.orgPhoneNumbers.length > 0,
                items: this.orgPhoneNumbers.map((phone) => ({
                    label: phone.label ? `${phone.label} ${this.phonePipe.transform(phone.number)}` : this.phonePipe.transform(phone.number),
                    routerLink: ['/phone-numbers', phone.id, 'config']
                }))
            }
        ];
    }
}
