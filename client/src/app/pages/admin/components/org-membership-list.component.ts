import { InviteStatus } from '@/api/models/enums/invite-status';
import { OrgRole } from '@/api/models/enums/org-role';
import { OrgMembership } from '@/api/models/org-membership';
import { User } from '@/api/models/user';
import { AdminService } from '@/api/services/admin.service';
import { AppAvatarComponent } from '@/components/app-avatar.component';
import { AppInviteStatusBadgeComponent } from '@/components/app-invite-status-badge.component';
import { AppModal } from '@/components/app-modal.component';
import { OrgRoleDisplayPipe } from '@/pipes/org-role.pipe';
import { Observable } from 'rxjs';

import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Organization } from '@models/organization';

import { MessageService } from 'primeng/api';
import { Button } from 'primeng/button';
import { Fluid } from 'primeng/fluid';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';

@Component({
    selector: 'orgs-membership-list',
    imports: [
        TableModule,
        CommonModule,
        ToastModule,
        SelectModule,
        AppInviteStatusBadgeComponent,
        OrgRoleDisplayPipe,
        FormsModule,
        AppModal,
        Button,
        Fluid,
        AppAvatarComponent
    ],
    templateUrl: './org-membership-list.component.html',
    providers: [MessageService]
})
export class OrgsMembershipListComponent implements OnInit {
    @Input() userId: string | null = null;
    @Input() orgId: string | null = null;

    @ViewChild(AppModal) modal!: AppModal;

    adminService = inject(AdminService);
    messageService = inject(MessageService);

    orgMemberships: OrgMembership[] = [];
    isLoadingModal: boolean = false;
    readonly allOrgRoles = OrgRole.values;
    allOrgs: Organization[] = [];
    allUsers: User[] = [];
    selectedOrg: Organization | null = null;
    selectedUser: User | null = null;
    selectedRole: OrgRole | null = null;

    ngOnInit(): void {
        this.reload();
    }

    reload(): void {
        // Only one of userId or orgId can be populated
        if (this.userId && this.orgId) {
            throw new Error('Only one of userId or orgId can be set.');
        }

        if (this.userId) {
            this.adminService.getUserOrgMemberships(this.userId).subscribe((memberships) => {
                this.orgMemberships = memberships;
            });
        } else if (this.orgId) {
            this.adminService.getOrgMembers(this.orgId).subscribe((memberships) => {
                this.orgMemberships = memberships;
            });
        }
    }

    addMembership(): void {
        this.isLoadingModal = true;

        if (this.userId) {
            this.adminService.getAllOrgs().subscribe((orgs) => {
                this.allOrgs = orgs;
                this.isLoadingModal = false;
                this.modal?.showModal();
            });
        } else if (this.orgId) {
            this.adminService.getAllUsers().subscribe((users) => {
                this.allUsers = users;
                this.isLoadingModal = false;
                this.modal?.showModal();
            });
        }
    }

    onSubmitNewMembership(): void {
        if (!this.selectedOrg && !this.selectedUser) {
            return;
        }

        let submissionObservable: Observable<void> | undefined;

        if (this.userId && this.selectedOrg) {
            // Add selected organization to user
            submissionObservable = this.adminService.addUserToOrg(this.userId, this.selectedOrg.id, OrgRole.Admin);
        } else if (this.orgId && this.selectedUser) {
            // Add selected user to organization
            submissionObservable = this.adminService.addUserToOrg(this.selectedUser.uid, this.orgId, OrgRole.Admin);
        }

        if (submissionObservable !== undefined) {
            submissionObservable.subscribe({
                next: () => {
                    this.reload();
                    this.resetModal();
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Membership added successfully.'
                    });
                },
                error: (err) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to add membership.'
                    });
                    console.error('Error adding membership:', err);
                    this.isLoadingModal = false;
                }
            });
        }
    }

    resetModal(): void {
        this.selectedOrg = null;
        this.selectedUser = null;
        this.selectedRole = null;
        this.isLoadingModal = false;
        this.modal?.hideModal();
    }
}
