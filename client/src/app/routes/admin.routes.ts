import { AdminDashboard } from '@/pages/admin/admin-dashboard.component';
import { OrgsComponent } from '@/pages/admin/orgs-master.component';
import { SystemUsersComponent } from '@/pages/admin/system-users-master.component';

import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
    {
        path: '',
        redirectTo: 'dashboard/orgs',
        pathMatch: 'full'
    },
    {
        path: 'dashboard',
        component: AdminDashboard,
        data: { breadcrumb: 'Admin Dashboard' },
        children: [
            {
                path: 'orgs',
                component: OrgsComponent
            },
            {
                path: 'system-users',
                component: SystemUsersComponent
            }
        ]
    }
];
