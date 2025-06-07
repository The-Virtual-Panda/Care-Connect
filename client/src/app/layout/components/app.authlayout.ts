import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppConfigurator } from './app.configurator';
import { LayoutService } from '@/layout/service/layout.service';
import { AppFooter } from './app.footer';

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
