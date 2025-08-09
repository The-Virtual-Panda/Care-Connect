import { Logger } from '@/utils/logger';
import { filter, startWith } from 'rxjs/operators';

import { DestroyRef, Injectable, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRouteSnapshot, NavigationEnd, NavigationExtras, Router, UrlTree } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class OrgContextService {
    private static readonly CURRENT_ORG_KEY = 'navigated-org-id';

    private router = inject(Router);
    private destroyRef = inject(DestroyRef);

    // Store orgId as a Signal, update it on navigation
    routeOrgId = signal<string | null>(null);

    constructor() {
        // set initial value from current snapshot
        this.routeOrgId.set(this.findOrgId(this.router.routerState.snapshot.root));

        // fallback to stored value if route didn’t provide one
        if (this.routeOrgId() === null) {
            const stored = this.readStoredOrgId();
            if (stored) this.routeOrgId.set(stored);
        }

        // update on every nav end (and immediately once)
        this.router.events
            .pipe(
                startWith<unknown>(null),
                filter((e) => e === null || e instanceof NavigationEnd),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe(() => {
                const id = this.findOrgId(this.router.routerState.snapshot.root);

                if (id === null) {
                    // don't update the org on null
                    Logger.log('Preserving known org in context: ' + this.routeOrgId());
                    return;
                } else if (id !== this.routeOrgId()) {
                    this.routeOrgId.set(id);
                }
            });

        // Effect: persist orgId changes to localStorage
        effect(() => {
            const id = this.routeOrgId();
            try {
                if (id) {
                    localStorage.setItem(OrgContextService.CURRENT_ORG_KEY, id);
                } else {
                    localStorage.removeItem(OrgContextService.CURRENT_ORG_KEY);
                }
            } catch {
                // ignore storage errors (e.g., private mode)
            }
        });
    }

    private readStoredOrgId(): string | null {
        try {
            return localStorage.getItem(OrgContextService.CURRENT_ORG_KEY);
        } catch {
            return null;
        }
    }

    private findOrgId(node: ActivatedRouteSnapshot | null): string | null {
        while (node) {
            const id = node.paramMap?.get('orgId');
            if (id) return id;
            node = node.firstChild ?? null;
        }
        return null;
    }

    /** Build a UrlTree under the current org prefix */
    link(commands: any[], extras?: NavigationExtras): UrlTree {
        const id = this.routeOrgId();
        if (!id) throw new Error('No orgId in route');
        return this.router.createUrlTree(['/organization', id, ...commands], extras);
    }

    /** Navigate while preserving current org prefix */
    go(commands: any[], extras?: NavigationExtras) {
        return this.router.navigateByUrl(this.link(commands, extras));
    }

    /** Switch to another org */
    switch(orgId: string, extras?: NavigationExtras) {
        return this.router.navigate(['/organization', orgId], extras);
    }
}
