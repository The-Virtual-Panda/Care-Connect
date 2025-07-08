import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppMenuitem } from './app.menuitem';
import { AuthService } from '@/api/services/auth.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: '[app-menu]',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
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
    private destroy$ = new Subject<void>();

    menuItems: any[] = [];

    ngOnInit() {
        // Subscribe to authentication state changes
        this.authService.user$.pipe(
            takeUntil(this.destroy$)
        ).subscribe(user => {
            const isLoggedIn = !!user;
            this.updateMenuItems(isLoggedIn);
        });
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private updateMenuItems(isLoggedIn: boolean) {
        this.menuItems = [
            {
                label: 'Home',
                icon: 'pi pi-home',
                routerLink: '/',
                visible: isLoggedIn,
            },
            { separator: true, visible: isLoggedIn },
            {
                label: 'Recipients',
                icon: 'pi pi-users',
                routerLink: 'recipients',
                visible: isLoggedIn,
            },
        ];
    }
}
