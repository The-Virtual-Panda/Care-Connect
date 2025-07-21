import { LayoutService } from '@/layouts/service/layout.service';

import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppConfigurator } from '../components/nav/app.configurator';
import { AppFooter } from '../components/nav/app.footer';

@Component({
    selector: 'auth-layout',
    standalone: true,
    imports: [RouterModule, AppConfigurator, AppFooter],
    template: `
        <main>
            <router-outlet></router-outlet>
            <div app-footer></div>
        </main>
        <app-configurator location="auth" />
    `
})
export class AuthLayout {
    layoutService: LayoutService = inject(LayoutService);
}
