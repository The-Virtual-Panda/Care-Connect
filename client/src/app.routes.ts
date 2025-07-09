import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { Routes } from '@angular/router';

import { AuthLayout } from '@/layout/components/app.authlayout';
import { AppLayout } from '@/layout/components/app.layout';
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
                path: 'phone-numbers/:id/config',
                loadComponent: () => import('@/pages/phone-configure/phone-configure.component').then((c) => c.PhoneConfigureComponent),
                data: { breadcrumb: 'Phone Configuration' }
            }
        ]
    },
    {
        path: '',
        component: AuthLayout,
        children: [
            {
                path: 'login',
                loadComponent: () => import('@/pages/auth/login.component').then((c) => c.Login)
            },
            {
                path: 'register',
                loadComponent: () => import('@/pages/auth/register.component').then((c) => c.Register)
            },
            {
                path: 'verification',
                loadComponent: () => import('@/pages/auth/verification').then((c) => c.Verification)
            },
            {
                path: 'forgot-password',
                loadComponent: () => import('@/pages/auth/forgotpassword').then((c) => c.ForgotPassword)
            },
            {
                path: 'new-password',
                loadComponent: () => import('@/pages/auth/newpassword').then((c) => c.NewPassword)
            }
        ]
    },
    {
        path: 'not-authorized',
        loadComponent: () => import('@/pages/auth/access').then((c) => c.Access)
    },
    { path: 'notfound', component: Notfound },
    { path: '**', redirectTo: '/notfound' }
];
