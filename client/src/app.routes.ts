import { Routes } from '@angular/router';
import { AppLayout } from '@/layout/components/app.layout';
import { Notfound } from '@/pages/notfound/notfound';
import { authGuard } from '@/guards/auth.guard';
import { AuthLayout } from '@/layout/components/app.authlayout';

export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        children: [
            {
                path: '',
                loadComponent: () => import('@/apps/blog/detail').then((c) => c.Detail),
                data: { breadcrumb: 'Home' },
                canActivate: [authGuard]
            },
            {
                path: 'team',
                loadComponent: () => import('@/pages/team/team.component').then((c) => c.TeamComponent),
                data: { breadcrumb: 'Team Members' },
                canActivate: [authGuard]
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
                loadComponent: () => import('@/pages/auth/register').then((c) => c.Register)
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
            },
        ]
    },
    {
        path: 'not-authorized',
        loadComponent: () => import('@/pages/auth/access').then((c) => c.Access)
    },
    { path: 'notfound', component: Notfound },
    { path: '**', redirectTo: '/notfound' }
];
