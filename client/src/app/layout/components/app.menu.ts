import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppMenuitem } from './app.menuitem';
import { AuthService } from '@/api/services/auth.service';
import { PhoneService } from '@/api/services/phone.service';
import { Subject, takeUntil, combineLatest } from 'rxjs';
import { PhoneNumber } from '@/api/models/phone-number';
import { PhonePipe } from '@/pipes/phone.pipe';

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
        // Subscribe to authentication state changes
        this.authService.user$.pipe(
            takeUntil(this.destroy$)
        ).subscribe(user => {
            const isLoggedIn = !!user;

            if (isLoggedIn) {
                this.currentOrgId = this.authService.currentOrgId;
                if (this.currentOrgId) {
                    // Check if the organization has phone numbers
                    this.phoneService.getOrgPhoneNumbers(this.currentOrgId).pipe(
                        takeUntil(this.destroy$)
                    ).subscribe(phoneNumbers => {
                        this.orgPhoneNumbers = phoneNumbers;
                        this.updateMenuItems();
                    });
                } else {
                    this.updateMenuItems();
                }
            } else {
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
            {
                label: 'Home',
                icon: 'pi pi-home',
                routerLink: '/',
            },
            { separator: true },
            {
                label: 'Recipients',
                icon: 'pi pi-users',
                routerLink: 'recipients',
            },
            { separator: true },
            {
                label: 'Phone Numbers',
                icon: 'pi pi-phone',
                visible: this.orgPhoneNumbers.length > 0,
                items: this.orgPhoneNumbers.map(phone => ({
                    label: phone.label ? `${phone.label} ${this.phonePipe.transform(phone.number)}` : this.phonePipe.transform(phone.number),
                    routerLink: ['/phone-numbers', phone.id, 'config']
                }))
            },
        ];
    }
}
