import { Routes } from '@angular/router';

export default [
    {
        path: 'documentation',
        loadComponent: () => import('@/pages/documentation/documentation').then((c) => c.Documentation)
    },
    { path: 'crud', loadComponent: () => import('@/pages/crud/crud').then((c) => c.Crud), data: { breadcrumb: 'Crud' } },
    { path: 'empty', loadComponent: () => import('@/pages/empty/empty').then((c) => c.Empty), data: { breadcrumb: 'Empty' } },
    {
        path: 'invoice',
        loadComponent: () => import('@/pages/invoice/invoice').then((c) => c.Invoice),
        data: { breadcrumb: 'Invoice' }
    },
    {
        path: 'aboutus',
        loadComponent: () => import('@/pages/aboutus/aboutus').then((c) => c.AboutUs),
        data: { breadcrumb: 'About' }
    },
    { path: 'help', loadComponent: () => import('@/pages/help/help').then((c) => c.Help), data: { breadcrumb: 'Help' } },
    { path: 'faq', loadComponent: () => import('@/pages/faq/faq').then((c) => c.Faq), data: { breadcrumb: 'FAQ' } },
    {
        path: 'contact',
        loadComponent: () => import('@/pages/contactus/contactus').then((c) => c.ContactUs),
        data: { breadcrumb: 'Contact Us' }
    },
    {
        path: 'error',
        redirectTo: '/notfound'
    },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
