import { AppTopbar } from '@/components/nav/app-topbar.component';
import { LayoutService } from '@/services/layout.service';

import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, computed } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppMenu } from './app.menu';

@Component({
    selector: '[app-sidebar]',
    standalone: true,
    imports: [CommonModule, AppMenu, RouterModule, AppTopbar],
    template: ` <div class="layout-sidebar" (mouseenter)="onMouseEnter()" (mouseleave)="onMouseLeave()">
        <div class="sidebar-header">
            <a class="logo" [routerLink]="['/']">
                <!-- <img class="logo-image" src="/layout/images/logo-{{ isDarkTheme() ? 'white' : 'dark' }}.svg" alt="logo" /> -->
                <span class="app-name text-4xl font-medium leading-normal">Care Connect</span></a
            >
            <button class="layout-sidebar-anchor z-2" type="button" (click)="anchor()"></button>
        </div>

        <div #menuContainer class="layout-menu-container">
            <div app-menu></div>
        </div>
        @if (isHorizontal() && !layoutService.isMobile()) {
            <div app-topbar></div>
        }
    </div>`
})
export class AppSidebar {
    timeout: any = null;

    isHorizontal = computed(() => this.layoutService.isHorizontal());
    isDarkTheme = computed(() => this.layoutService.isDarkTheme());

    @ViewChild('menuContainer') menuContainer!: ElementRef;

    constructor(
        public layoutService: LayoutService,
        public el: ElementRef
    ) {}

    onMouseEnter() {
        if (!this.layoutService.layoutState().anchored) {
            if (this.timeout) {
                clearTimeout(this.timeout);
                this.timeout = null;
            }

            this.layoutService.layoutState.update((state) => {
                if (!state.sidebarActive) {
                    return {
                        ...state,
                        sidebarActive: true
                    };
                }
                return state;
            });
        }
    }

    onMouseLeave() {
        if (!this.layoutService.layoutState().anchored) {
            if (!this.timeout) {
                this.timeout = setTimeout(() => {
                    this.layoutService.layoutState.update((state) => {
                        if (state.sidebarActive) {
                            return {
                                ...state,
                                sidebarActive: false
                            };
                        }
                        return state;
                    });
                }, 300);
            }
        }
    }

    anchor() {
        this.layoutService.layoutState.update((state) => ({
            ...state,
            anchored: !state.anchored
        }));
    }
}
