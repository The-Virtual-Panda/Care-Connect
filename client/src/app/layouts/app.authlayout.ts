import { LayoutService } from '@/services/layout.service';

import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppFooter } from '@components/nav/app.footer';

import { Toast } from 'primeng/toast';

@Component({
    selector: 'auth-layout',
    standalone: true,
    imports: [RouterModule, AppFooter, Toast],
    template: `
        <main>
            <p-toast key="global-toast" position="bottom-right" />
            <router-outlet></router-outlet>
            <div app-footer></div>
        </main>
    `
})
export class AuthLayout {
    layoutService: LayoutService = inject(LayoutService);
}
