export enum OrgRole {
    Admin = 'admin'
}

export namespace OrgRole {
    export function display(role: OrgRole): string {
        switch (role) {
            case OrgRole.Admin:
                return 'Admin';
            default:
                return role;
        }
    }
}
