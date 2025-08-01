import { AppBreadcrumb } from '@/components/nav/app.breadcrumb';
import { AppFooter } from '@/components/nav/app.footer';
import { AppRightMenu } from '@/components/nav/app.rightmenu';
import { AppSearch } from '@/components/nav/app.search';
import { LayoutService } from '@/services/layout.service';
import { Subscription, filter } from 'rxjs';

import { CommonModule } from '@angular/common';
import { Component, Renderer2, ViewChild, computed } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';

import { Toast } from 'primeng/toast';

import { AppTopbar } from '../components/nav/app-topbar.component';
import { AppSidebar } from '../components/nav/app.sidebar';

@Component({
    selector: 'app-layout',
    standalone: true,
    imports: [CommonModule, AppTopbar, AppSidebar, RouterModule, AppBreadcrumb, AppFooter, AppSearch, AppRightMenu, Toast],
    template: `
        <p-toast key="global-toast" position="bottom-right" />
        <div class="layout-wrapper" [ngClass]="containerClass()">
            <div app-sidebar></div>

            <div class="layout-content-wrapper">
                <div class="layout-content-wrapper-inside">
                    <div app-topbar></div>

                    <div class="layout-content">
                        <div app-breadcrumb></div>
                        <router-outlet></router-outlet>
                    </div>

                    <div app-footer></div>
                </div>
            </div>

            <div app-search></div>
            <div app-rightmenu></div>
            <div class="layout-mask animate-fadein"></div>
        </div>
    `
})
export class AppLayout {
    overlayMenuOpenSubscription: Subscription;

    menuOutsideClickListener: any;

    menuScrollListener: any;

    @ViewChild(AppSidebar) appSidebar!: AppSidebar;

    @ViewChild(AppTopbar) appTopBar!: AppTopbar;

    constructor(
        public layoutService: LayoutService,
        public renderer: Renderer2,
        public router: Router
    ) {
        this.overlayMenuOpenSubscription = this.layoutService.overlayOpen$.subscribe(() => {
            if (!this.menuOutsideClickListener) {
                this.menuOutsideClickListener = this.renderer.listen('document', 'click', (event) => this.outsideClickListener(event));
            }
            if ((this.layoutService.isHorizontal() || this.layoutService.isSlim() || this.layoutService.isCompact()) && !this.menuScrollListener) {
                this.menuScrollListener = this.renderer.listen(this.appSidebar.menuContainer.nativeElement, 'scroll', (event) => {
                    if (this.layoutService.isDesktop()) {
                        this.hideMenu();
                    }
                });
            }
            if (this.layoutService.layoutState().staticMenuMobileActive) {
                this.blockBodyScroll();
            }
        });

        this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
            this.hideMenu();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    outsideClickListener(event: any) {
        if (this.isOutsideClicked(event)) {
            this.hideMenu();
        }
    }

    isOutsideClicked(event: any) {
        const sidebarEl = document.querySelector('.layout-sidebar');
        const topbarButtonEl = document.querySelector('.topbar-left > a');

        return !(
            sidebarEl?.isSameNode(event.target) ||
            sidebarEl?.contains(event.target) ||
            topbarButtonEl?.isSameNode(event.target) ||
            topbarButtonEl?.contains(event.target)
        );
    }

    hideMenu() {
        this.layoutService.layoutState.update((prev) => ({
            ...prev,
            overlayMenuActive: false,
            staticMenuMobileActive: false,
            menuHoverActive: false
        }));
        if (this.layoutService.isHorizontal()) {
            this.layoutService.onMenuStateChange({ key: '' });
        }

        if (this.menuOutsideClickListener) {
            this.menuOutsideClickListener();
            this.menuOutsideClickListener = null;
        }

        if (this.menuScrollListener) {
            this.menuScrollListener();
            this.menuScrollListener = null;
        }

        this.unblockBodyScroll();
    }

    blockBodyScroll(): void {
        if (document.body.classList) {
            document.body.classList.add('blocked-scroll');
        } else {
            document.body.className += ' blocked-scroll';
        }
    }

    unblockBodyScroll(): void {
        if (document.body.classList) {
            document.body.classList.remove('blocked-scroll');
        } else {
            document.body.className = document.body.className.replace(new RegExp('(^|\\b)' + 'blocked-scroll'.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
    }

    containerClass = computed(() => {
        const layoutConfig = this.layoutService.layoutConfig();
        const layoutState = this.layoutService.layoutState();

        return {
            'layout-overlay': layoutConfig.menuMode === 'overlay',
            'layout-static': layoutConfig.menuMode === 'static',
            'layout-slim': layoutConfig.menuMode === 'slim',
            'layout-horizontal': layoutConfig.menuMode === 'horizontal',
            'layout-compact': layoutConfig.menuMode === 'compact',
            'layout-reveal': layoutConfig.menuMode === 'reveal',
            'layout-drawer': layoutConfig.menuMode === 'drawer',
            'layout-overlay-active': layoutState.overlayMenuActive || layoutState.staticMenuMobileActive,
            'layout-mobile-active': layoutState.staticMenuMobileActive,
            'layout-static-inactive': layoutState.staticMenuDesktopInactive && layoutConfig.menuMode === 'static',
            'layout-sidebar-active': layoutState.sidebarActive,
            'layout-sidebar-anchored': layoutState.anchored
        };
    });

    ngOnDestroy() {
        if (this.overlayMenuOpenSubscription) {
            this.overlayMenuOpenSubscription.unsubscribe();
        }

        if (this.menuOutsideClickListener) {
            this.menuOutsideClickListener();
        }
    }
}
