export enum OrgPermissionGroup {
    Org = 'org',
    Phone = 'phone',
    Observe = 'observe'
}

export namespace OrgPermissionGroup {
    export const values: OrgPermissionGroup[] = Object.values(OrgPermissionGroup) as OrgPermissionGroup[];

    export function display(role: OrgPermissionGroup): string {
        switch (role) {
            case OrgPermissionGroup.Org:
                return 'Organization';
            case OrgPermissionGroup.Phone:
                return 'Phone';
            case OrgPermissionGroup.Observe:
                return 'Observe';
            default:
                return role;
        }
    }
}

export enum OrgPermission {
    // Org
    OrgGeneral = 'org.general',
    OrgBilling = 'org.billing',
    OrgRoles = 'org.roles',
    OrgTeamMembers = 'org.teamMembers',
    OrgPhoneNumbers = 'org.phoneNumbers',

    // Phone
    PhoneInbox = 'phone.inbox',
    PhoneContacts = 'phone.contacts',
    PhoneCallHistory = 'phone.callHistory',
    PhoneVoicemails = 'phone.voicemails',
    PhoneManagement = 'phone.management',

    // Observe
    ObserveSystemLogs = 'observe.systemLogs',
    ObserveUsageMetrics = 'observe.usageMetrics'
}

export const PermissionMeta: Record<OrgPermission, { group: OrgPermissionGroup; label: string; implies?: OrgPermission[] }> = {
    // Org
    [OrgPermission.OrgGeneral]: { group: OrgPermissionGroup.Org, label: 'General Details' },
    [OrgPermission.OrgBilling]: { group: OrgPermissionGroup.Org, label: 'Billing' },
    [OrgPermission.OrgRoles]: { group: OrgPermissionGroup.Org, label: 'Roles & Permissions' },
    [OrgPermission.OrgTeamMembers]: { group: OrgPermissionGroup.Org, label: 'Team Members' },
    [OrgPermission.OrgPhoneNumbers]: { group: OrgPermissionGroup.Org, label: 'Phone Numbers' },

    // Observe
    [OrgPermission.ObserveSystemLogs]: { group: OrgPermissionGroup.Observe, label: 'System Logs' },
    [OrgPermission.ObserveUsageMetrics]: { group: OrgPermissionGroup.Observe, label: 'Usage Metrics' },

    // Phone
    [OrgPermission.PhoneInbox]: {
        group: OrgPermissionGroup.Phone,
        label: 'Inbox',
        implies: [OrgPermission.PhoneContacts]
    },
    [OrgPermission.PhoneContacts]: { group: OrgPermissionGroup.Phone, label: 'Contacts' },
    [OrgPermission.PhoneCallHistory]: { group: OrgPermissionGroup.Phone, label: 'Call History' },
    [OrgPermission.PhoneVoicemails]: { group: OrgPermissionGroup.Phone, label: 'Voicemails' },
    [OrgPermission.PhoneManagement]: {
        group: OrgPermissionGroup.Phone,
        label: 'Management',
        implies: [OrgPermission.PhoneInbox, OrgPermission.PhoneContacts, OrgPermission.PhoneCallHistory, OrgPermission.PhoneVoicemails]
    }
};

export namespace OrgPermission {
    export const values: OrgPermission[] = Object.values(OrgPermission) as OrgPermission[];

    export function display(perm: OrgPermission): string {
        return PermissionMeta[perm]?.label ?? perm;
    }

    export function groupOf(perm: OrgPermission): OrgPermissionGroup {
        return PermissionMeta[perm]?.group;
    }

    export function isInGroup(perm: OrgPermission, group: OrgPermissionGroup): boolean {
        return groupOf(perm) === group;
    }

    export function byGroup(group: OrgPermissionGroup): OrgPermission[] {
        return values.filter((p) => isInGroup(p, group));
    }

    export function expandImplied(perms: OrgPermission[]): OrgPermission[] {
        const out = new Set<OrgPermission>(perms);

        const stack = [...perms];
        while (stack.length) {
            const p = stack.pop()!;
            const implies = PermissionMeta[p]?.implies ?? [];
            for (const ip of implies) {
                if (!out.has(ip)) {
                    out.add(ip);
                    stack.push(ip);
                }
            }
        }
        return Array.from(out);
    }

    export function isAllowed(selected: OrgPermission[], perm: OrgPermission): boolean {
        return expandImplied(selected).includes(perm);
    }
}
