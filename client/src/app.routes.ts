import { AuthLayout } from '@/layouts/app.authlayout';
import { AppLayout } from '@/layouts/app.layout';
import { Access } from '@/pages/auth/access';
import { ChangeBlogComponent } from '@/pages/change-blog/change-blog.component';
import { Notfound } from '@/pages/global/notfound';
import { OrgContextService } from '@/services/org-context.service';

import { Injectable, inject } from '@angular/core';
import { canActivate, hasCustomClaim, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { CanActivate, Router, Routes, UrlTree } from '@angular/router';

import { Logger } from '@app/utils/logger';

const adminOnly = () => hasCustomClaim('systemAdmin');

@Injectable({ providedIn: 'root' })
class OrgRedirectGuard implements CanActivate {
    private router = inject(Router);
    private orgContextService = inject(OrgContextService);

    async canActivate(): Promise<boolean | UrlTree> {
        const defaultOrgId = await this.orgContextService.routeOrgId();

        // Route to a saved navigation
        if (!defaultOrgId) {
            // TODO: Query the default organization for the user, and if still empty, no-orgs!
            Logger.log('No default organization found for user');
            return this.router.createUrlTree(['/no-org']);
        }

        return this.router.createUrlTree(['/organization', defaultOrgId]);
    }
}

export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        ...canActivate(() => redirectUnauthorizedTo(['login'])),
        children: [
            {
                path: '',
                redirectTo: '/organization',
                pathMatch: 'full'
            },
            // Hit /organization → bounce to user's default org
            { path: 'organization', canActivate: [OrgRedirectGuard], pathMatch: 'full', children: [] },
            {
                path: 'organization/:orgId',
                loadChildren: () => import('@/routes/org.routes').then((m) => m.orgRoutes)
            },
            {
                path: 'admin',
                ...canActivate(adminOnly),
                loadChildren: () => import('@/routes/admin.routes').then((m) => m.adminRoutes),
                data: { breadcrumb: 'Admin' }
            },
            {
                path: 'settings',
                loadChildren: () => import('@/routes/settings.routes').then((m) => m.settingsRoutes)
            },
            {
                path: 'release-notes',
                component: ChangeBlogComponent
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
