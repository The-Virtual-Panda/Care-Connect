import { OrgRecipientsMasterComponent } from '@/pages/org/recipient/recipients-master.component';
import { OrgRolesMasterComponent } from '@/pages/org/roles/roles-master.component';

import { Routes } from '@angular/router';

export const orgRoutes: Routes = [
    {
        path: 'recipients',
        component: OrgRecipientsMasterComponent,
        data: { breadcrumb: 'Recipients' }
    },
    {
        path: 'roles',
        component: OrgRolesMasterComponent,
        data: { breadcrumb: 'Roles & Permissions' }
    }
];
