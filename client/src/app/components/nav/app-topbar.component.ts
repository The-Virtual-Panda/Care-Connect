import { OrgMembership } from '@/api/models/entity/org-membership';
import { Organization } from '@/api/models/entity/organization';
import { AuthService } from '@/api/services/auth.service';
import { UserService } from '@/api/services/user.service';
import { ChangeBlogService } from '@/services/change-blog.service';
import { LayoutService } from '@/services/layout.service';
import { OrgContextService } from '@/services/org-context.service';
import { ToastService } from '@/services/toast.service';
import { Logger } from '@/utils/logger';

import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { RippleModule } from 'primeng/ripple';
import { Select } from 'primeng/select';
import { StyleClassModule } from 'primeng/styleclass';
import { TooltipModule } from 'primeng/tooltip';

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
        TooltipModule,
        AppAvatarComponent,
        DividerModule
    ]
})
export class AppTopbar {
    authService = inject(AuthService);
    changeBlogService = inject(ChangeBlogService);
    private layoutService = inject(LayoutService);
    private userService = inject(UserService);
    private router = inject(Router);
    private toastService = inject(ToastService);
    private orgContextService = inject(OrgContextService);

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
                const currentOrgId = this.orgContextService.routeOrgId();
                const focusedOrg = orgs.find((org) => org.id === currentOrgId);

                if (focusedOrg) {
                    this.selectedOrg = focusedOrg;
                } else if (orgs.length > 0) {
                    this.selectedOrg = orgs[0];
                }
            },
            error: (err) => {
                this.isLoadingUserOrgs.set(false);
                Logger.error('Failed to load organizations:', err);
            }
        });
    }

    switchOrganization(org: Organization) {
        const currentOrgId = this.orgContextService.routeOrgId();

        if (!org || org.id === currentOrgId) {
            return; // No change needed
        }

        Logger.log('Switching organization to:', org.name, org.id);
        this.userService.changeDefaultOrg(this.authService.userId(), org.id!).subscribe({
            next: () => {
                this.authService.userSession.update((state) => ({
                    ...state!,
                    focusedOrg: org
                }));
                this.toastService.showSuccess('Switched organization', `You are now working in ${org.name}`);
                Logger.log('Switched organization successfully:', org.name, org.id);
                this.router.navigate(['/']);
            },
            error: (err) => {
                this.toastService.showError('Error switching orgs', 'Failed to switch organization. Please try again.');
                Logger.error('Failed to switch organization:', err);
            }
        });
    }
}
