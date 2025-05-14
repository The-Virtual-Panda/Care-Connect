import { Routes } from '@angular/router';
import { LandingLayout } from '@/layout/components/app.landinglayout';
import { Notfound } from '@/pages/notfound/notfound';

export const appRoutes: Routes = [
    {
        path: '',
        component: LandingLayout,
        children: [
            {
                path: '',
                loadComponent: () => import('@/pages/landing').then((c) => c.Landing)
            },
            {
                path: 'about',
                loadComponent: () => import('@/pages/landing/about').then((c) => c.About)
            },
            {
                path: 'pricing',
                loadComponent: () => import('@/pages/landing/pricing').then((c) => c.Pricing)
            },
            {
                path: 'contact',
                loadComponent: () => import('@/pages/landing/contact').then((c) => c.Contact)
            },
            {
                path: 'oops',
                loadComponent: () => import('@/pages/oops/oops').then((c) => c.Oops)
            },
            {
                path: 'access',
                loadComponent: () => import('@/pages/auth/access').then((c) => c.Access)
            },
            {
                path: 'error',
                redirectTo: '/notfound'
            }
        ]
    },
    { path: 'notfound', component: Notfound },
    { path: '**', redirectTo: '/notfound' }
];
