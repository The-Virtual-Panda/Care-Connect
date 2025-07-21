import { AuthLayout } from '@/layouts/app.authlayout';
import { AppLayout } from '@/layouts/app.layout';
import { Access } from '@/pages/auth/access';
import { Notfound } from '@/pages/notfound/notfound';

import { canActivate, hasCustomClaim, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { Routes } from '@angular/router';

const adminOnly = () => hasCustomClaim('systemAdmin');

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
                ...canActivate(adminOnly),
                loadChildren: () => import('@/routes/admin.routes').then((m) => m.adminRoutes)
            },
            {
                path: 'profile',
                loadChildren: () => import('@/routes/profile.routes').then((m) => m.profileRoutes)
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
