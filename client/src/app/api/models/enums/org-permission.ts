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
    PhoneCallFlow = 'phone.callFlow',

    // Observe
    ObserveSystemLogs = 'observe.systemLogs',
    ObserveUsageMetrics = 'observe.usageMetrics'
}

export const PermissionMeta: Record<OrgPermission, { group: OrgPermissionGroup; label: string; isAvailable: boolean; implies?: OrgPermission[] }> = {
    // Org
    [OrgPermission.OrgGeneral]: { group: OrgPermissionGroup.Org, label: 'General Details', isAvailable: false },
    [OrgPermission.OrgBilling]: { group: OrgPermissionGroup.Org, label: 'Billing', isAvailable: true },
    [OrgPermission.OrgRoles]: { group: OrgPermissionGroup.Org, label: 'Roles & Permissions', isAvailable: true },
    [OrgPermission.OrgTeamMembers]: { group: OrgPermissionGroup.Org, label: 'Team Members', isAvailable: true },
    [OrgPermission.OrgPhoneNumbers]: { group: OrgPermissionGroup.Org, label: 'Phone Numbers', isAvailable: false },

    // Observe
    [OrgPermission.ObserveSystemLogs]: { group: OrgPermissionGroup.Observe, label: 'System Logs', isAvailable: false },
    [OrgPermission.ObserveUsageMetrics]: { group: OrgPermissionGroup.Observe, label: 'Usage Metrics', isAvailable: false },

    // Phone
    [OrgPermission.PhoneInbox]: {
        group: OrgPermissionGroup.Phone,
        label: 'Inbox',
        isAvailable: false,
        implies: [OrgPermission.PhoneContacts]
    },
    [OrgPermission.PhoneContacts]: { group: OrgPermissionGroup.Phone, label: 'Contacts', isAvailable: false },
    [OrgPermission.PhoneCallHistory]: { group: OrgPermissionGroup.Phone, label: 'Call History', isAvailable: true },
    [OrgPermission.PhoneVoicemails]: { group: OrgPermissionGroup.Phone, label: 'Voicemails', isAvailable: false },
    [OrgPermission.PhoneCallFlow]: {
        group: OrgPermissionGroup.Phone,
        label: 'Call Flow',
        isAvailable: true,
        implies: [OrgPermission.PhoneInbox, OrgPermission.PhoneContacts, OrgPermission.PhoneCallHistory, OrgPermission.PhoneVoicemails]
    }
};

export namespace OrgPermission {
    export const values: OrgPermission[] = Object.values(OrgPermission) as OrgPermission[];

    export function display(perm: OrgPermission): string {
        return PermissionMeta[perm]?.label ?? perm;
    }

    export function isAvailable(permission: OrgPermission): boolean {
        return PermissionMeta[permission]?.isAvailable ?? false;
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
