import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { Routes } from '@angular/router';

import { AuthLayout } from '@/layout/components/app.authlayout';
import { AppLayout } from '@/layout/components/app.layout';
import { Access } from '@/pages/auth/access';
import { Notfound } from '@/pages/notfound/notfound';

export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        ...canActivate(() => redirectUnauthorizedTo(['login'])),
        children: [
            {
                path: '',
                redirectTo: 'recipients',
                pathMatch: 'full'
            },
            {
                path: 'recipients',
                loadComponent: () => import('@/pages/recipient/recipient-master.component').then((c) => c.RecipientMasterComponent),
                data: { breadcrumb: 'Recipients' }
            },
            {
                path: 'phone-numbers',
                loadChildren: () => import('@/routes/phone.routes').then((m) => m.phoneRoutes),
                data: { breadcrumb: 'Phone' }
            },
            {
                path: 'admin',
                loadChildren: () => import('@/routes/admin.routes').then((m) => m.adminRoutes)
            }
        ]
    },
    {
        path: '',
        component: AuthLayout,
        loadChildren: () => import('@/routes/auth.routes').then((m) => m.authRoutes)
    },
    { path: 'not-authorized', component: Access },
    { path: 'notfound', component: Notfound },
    { path: '**', redirectTo: '/notfound' }
];
