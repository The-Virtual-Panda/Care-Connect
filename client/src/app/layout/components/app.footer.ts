import { environment } from 'src/environments/environment';

import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';

import { LayoutService } from '@/layout/service/layout.service';
import { Logger } from '@/utils/logger';

import { MessageModule } from 'primeng/message';

@Component({
    selector: '[app-footer]',
    standalone: true,
    imports: [CommonModule, MessageModule],
    template: `
        <div class="layout-footer">
            <div class="footer-logo-container">
                <!-- <img src="/layout/images/logo-{{ isDarkTheme() ? 'white' : 'dark' }}.svg" alt="poseidon-layout"/> -->
                <span class="footer-app-name">Care Connect</span>
            </div>
            <div class="flex items-center gap-4">
                <span class="text-muted-color">v{{ version }}</span>
                <p-message *ngIf="!isProd" severity="info" text="Dev"></p-message>
                <p-message *ngIf="useEmulators" severity="info" text="Emulators"></p-message>
            </div>
            <span class="footer-copyright">&#169; The Virtual Panda - 2025</span>
        </div>
    `
})
export class AppFooter {
    layoutService = inject(LayoutService);
    version = environment.version;
    isProd = environment.production;
    useEmulators = environment.useEmulators;

    constructor() {
        Logger.info(this.useEmulators ? 'Using emulators' : 'Not using emulators');
        Logger.info(`App version: ${this.version}`);
        Logger.info(`Production mode: ${this.isProd}`);
    }

    isDarkTheme = computed(() => this.layoutService.isDarkTheme());
}
