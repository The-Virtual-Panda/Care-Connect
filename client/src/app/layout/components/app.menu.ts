import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppMenuitem } from './app.menuitem';
import { AuthService } from '@/services/auth.service';

@Component({
    selector: '[app-menu]',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `
        <ul class="layout-menu">
            <ng-container *ngFor="let item of model; let i = index">
                <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
                <li *ngIf="item.separator" class="menu-separator"></li>
            </ng-container>
        </ul>
    `
})
export class AppMenu {
    private authService = inject(AuthService);

    model: any[] = [
        {
            label: 'Home',
            icon: 'pi pi-home',
            routerLink: '/',
            visible: this.authService.isLoggedIn(),
        },
        { separator: true },
        {
            label: 'Team',
            icon: 'pi pi-users',
            routerLink: 'team',
            visible: this.authService.isLoggedIn(),
        },
    ];
}
