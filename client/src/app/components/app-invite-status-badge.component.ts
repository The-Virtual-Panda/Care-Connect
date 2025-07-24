import { Component, Input } from '@angular/core';

import { InviteStatus } from '@models/enums/invite-status';

import { TagModule } from 'primeng/tag';

const SEVERITY = {
    [InviteStatus.Active]: 'success',
    [InviteStatus.Invited]: 'info',
    [InviteStatus.Suspended]: 'danger'
};

const LABELS = {
    [InviteStatus.Active]: 'Active',
    [InviteStatus.Invited]: 'Invited',
    [InviteStatus.Suspended]: 'Suspended'
};

@Component({
    selector: 'app-invite-status-badge',
    imports: [TagModule],
    template: ` <p-tag [severity]="SEVERITY[status]">{{ LABELS[status] }}</p-tag> `
})
export class AppInviteStatusBadgeComponent {
    @Input() status!: InviteStatus;
    readonly SEVERITY = SEVERITY;
    readonly LABELS = LABELS;
}
