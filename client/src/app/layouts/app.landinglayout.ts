import { LayoutService } from '@/layouts/service/layout.service';
import { FooterWidget } from '@/pages/landing/components/footerwidget';
import { TopbarWidget } from '@/pages/landing/components/topbarwidget';

import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppConfigurator } from '../components/nav/app.configurator';

@Component({
    selector: 'app-landing-layout',
    standalone: true,
    imports: [CommonModule, TopbarWidget, RouterModule, FooterWidget, AppConfigurator],
    template: ` <div class="min-h-screen w-full">
        <topbar-widget />
        <main>
            <router-outlet />
        </main>
        <footer-widget />
        <button class="layout-config-button config-link" (click)="layoutService.toggleConfigSidebar()">
            <i class="pi pi-cog"></i>
        </button>
        <app-configurator location="landing" />
    </div>`
})
export class LandingLayout {
    layoutService: LayoutService = inject(LayoutService);
}
