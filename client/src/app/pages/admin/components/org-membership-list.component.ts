import { OrgMembership } from '@/api/models/org-membership';
import { AdminService } from '@/api/services/admin.service';
import { AppInviteStatusBadgeComponent } from '@/components/app-invite-status-badge.component';
import { OrgRoleDisplayPipe } from '@/pipes/org-role.pipe';
import { Logger } from '@/utils/logger';

import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';

import { TableModule } from 'primeng/table';

@Component({
    selector: 'orgs-membership-list',
    imports: [TableModule, CommonModule, AppInviteStatusBadgeComponent, OrgRoleDisplayPipe],
    templateUrl: './org-membership-list.component.html'
})
export class OrgsMembershipListComponent implements OnInit {
    @Input() userId: string | null = null;
    @Input() orgId: string | null = null;

    adminService = inject(AdminService);
    orgMemberships: OrgMembership[] = [];

    ngOnInit(): void {
        // Only one of userId or orgId can be populated
        if (this.userId && this.orgId) {
            throw new Error('Only one of userId or orgId can be set.');
        }

        Logger.log('OrgsMembershipListComponent initialized with:', { userId: this.userId, orgId: this.orgId });

        if (this.userId) {
            this.adminService.getUserOrgMemberships(this.userId).subscribe((memberships) => {
                this.orgMemberships = memberships;
            });
        } else if (this.orgId) {
            console.warn('orgId is set, fetching members for organization:', this.orgId);
            this.adminService.getOrgMembers(this.orgId).subscribe((memberships) => {
                this.orgMemberships = memberships;
            });
        }
    }
}
