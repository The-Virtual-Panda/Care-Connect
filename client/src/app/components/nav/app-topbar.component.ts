import { OrgMembership } from '@/api/models/org-membership';
import { Organization } from '@/api/models/organization';
import { AuthService } from '@/api/services/auth.service';
import { UserService } from '@/api/services/user.service';
import { LayoutService } from '@/layouts/service/layout.service';
import { Logger } from '@/utils/logger';

import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, computed, inject, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { RippleModule } from 'primeng/ripple';
import { Select } from 'primeng/select';
import { StyleClassModule } from 'primeng/styleclass';

import { AppAvatarComponent } from '../app-avatar.component';
import { AppBreadcrumb } from './app.breadcrumb';

@Component({
    selector: '[app-topbar]',
    standalone: true,
    templateUrl: './app-topbar.component.html',
    imports: [
        RouterModule,
        CommonModule,
        FormsModule,
        StyleClassModule,
        AppBreadcrumb,
        InputTextModule,
        ButtonModule,
        IconFieldModule,
        InputIconModule,
        RippleModule,
        BadgeModule,
        OverlayBadgeModule,
        AvatarModule,
        Select,
        AppAvatarComponent
    ]
})
export class AppTopbar {
    layoutService = inject(LayoutService);
    authService = inject(AuthService);
    userService = inject(UserService);

    isDarkTheme = computed(() => this.layoutService.isDarkTheme());
    isLoadingUserOrgs = signal(false);

    userOrganizations: Array<Organization & { membership: OrgMembership }> = [];
    selectedOrg: Organization | null = null;

    @ViewChild('menubutton') menuButton!: ElementRef;

    onMenuButtonClick() {
        this.layoutService.onMenuToggle();
    }

    showRightMenu() {
        this.layoutService.toggleRightMenu();
    }

    logout() {
        this.authService.logout();
    }

    ngOnInit() {
        this.loadUserOrganizations();
    }

    loadUserOrganizations() {
        this.isLoadingUserOrgs.set(true);
        this.userService.getUserOrganizations(this.authService.userId()).subscribe({
            next: (orgs) => {
                this.isLoadingUserOrgs.set(false);
                this.userOrganizations = orgs;

                // Set the current organization based on focused org
                const currentOrgId = this.authService.currentOrgId();
                const focusedOrg = orgs.find((org) => org.id === currentOrgId);

                if (focusedOrg) {
                    this.selectedOrg = focusedOrg;
                } else if (orgs.length > 0) {
                    this.selectedOrg = orgs[0];
                }
            },
            error: (err) => {
                this.isLoadingUserOrgs.set(false);
                console.error('Failed to load organizations:', err);
            }
        });
    }

    switchOrganization(org: Organization) {
        throw new Error('Method not implemented.');
    }
}
