import { OrgsComponent } from '@/pages/admin/orgs-master.component';
import { SystemUsersComponent } from '@/pages/admin/system-users-master.component';

import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
    {
        path: '',
        redirectTo: 'organizations',
        pathMatch: 'full'
    },
    {
        path: 'organizations',
        component: OrgsComponent,
        data: { breadcrumb: 'Organizations' }
    },
    {
        path: 'system-users',
        component: SystemUsersComponent,
        data: { breadcrumb: 'System Users' }
    }
];
