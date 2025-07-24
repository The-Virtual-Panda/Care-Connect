export enum OrgRole {
    Admin = 'admin'
}

export namespace OrgRole {
    export const values: OrgRole[] = Object.values(OrgRole).filter((v): v is OrgRole => typeof v === 'string');

    export function display(role: OrgRole): string {
        switch (role) {
            case OrgRole.Admin:
                return 'Admin';
            default:
                return role;
        }
    }
}
