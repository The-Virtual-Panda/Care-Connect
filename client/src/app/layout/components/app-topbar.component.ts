import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, computed, inject, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AuthService } from '@/api/services/auth.service';
import { LayoutService } from '@/layout/service/layout.service';

import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { RippleModule } from 'primeng/ripple';
import { StyleClassModule } from 'primeng/styleclass';

import { AppBreadcrumb } from './app.breadcrumb';

interface NotificationsBars {
    id: string;
    label: string;
    badge?: string | any;
}

@Component({
    selector: '[app-topbar]',
    standalone: true,
    imports: [
        RouterModule,
        CommonModule,
        FormsModule,
        StyleClassModule,
        AppBreadcrumb,
        InputTextModule,
        ButtonModule,
        IconFieldModule,
        InputIconModule,
        RippleModule,
        BadgeModule,
        OverlayBadgeModule,
        AvatarModule
    ],
    templateUrl: './app-topbar.component.html'
})
export class AppTopbar {
    layoutService = inject(LayoutService);
    authService = inject(AuthService);

    isDarkTheme = computed(() => this.layoutService.isDarkTheme());

    @ViewChild('menubutton') menuButton!: ElementRef;

    notificationSearch = '';

    notificationsBars = signal<NotificationsBars[]>([
        {
            id: 'inbox',
            label: 'Inbox',
            badge: '2'
        },
        {
            id: 'general',
            label: 'General'
        },
        {
            id: 'archived',
            label: 'Archived'
        }
    ]);

    notifications = signal<any[]>([
        {
            id: 'inbox',
            data: [
                {
                    image: '/demo/images/avatar/avatar-square-m-2.jpg',
                    name: 'Michael Lee',
                    description: 'You have a new message from the support team regarding your recent inquiry.',
                    time: '1 hour ago',
                    attachment: {
                        title: 'Contract',
                        size: '2.1 MB'
                    },
                    read: false
                },
                {
                    image: '/demo/images/avatar/avatar-square-f-1.jpg',
                    name: 'Alice Johnson',
                    description: 'Your report has been successfully submitted and is under review.',
                    time: '10 minutes ago',
                    read: true
                },
                {
                    image: '/demo/images/avatar/avatar-square-f-2.jpg',
                    name: 'Emily Davis',
                    description: 'The project deadline has been updated to September 30th. Please check the details.',
                    time: 'Yesterday at 4:35 PM',
                    read: false
                }
            ]
        },
        {
            id: 'general',
            data: [
                {
                    image: '/demo/images/avatar/avatar-square-f-1.jpg',
                    name: 'Alice Johnson',
                    description: 'Reminder: Your subscription is about to expire in 3 days. Renew now to avoid interruption.',
                    time: '30 minutes ago',
                    read: true
                },
                {
                    image: '/demo/images/avatar/avatar-square-m-2.jpg',
                    name: 'Michael Lee',
                    description: 'The server maintenance has been completed successfully. No further downtime is expected.',
                    time: 'Yesterday at 2:15 PM',
                    read: false
                }
            ]
        },
        {
            id: 'archived',
            data: [
                {
                    image: '/demo/images/avatar/avatar-square-m-1.jpg',
                    name: 'Lucas Brown',
                    description: 'Your appointment with Dr. Anderson has been confirmed for October 12th at 10:00 AM.',
                    time: '1 week ago',
                    read: false
                },
                {
                    image: '/demo/images/avatar/avatar-square-f-2.jpg',
                    name: 'Emily Davis',
                    description: 'The document you uploaded has been successfully archived for future reference.',
                    time: '2 weeks ago',
                    read: true
                }
            ]
        }
    ]);

    selectedNotificationBar = model(this.notificationsBars()[0].id ?? 'inbox');

    selectedNotificationsBarData = computed(() => this.notifications().find((f) => f.id === this.selectedNotificationBar()).data);

    onMenuButtonClick() {
        this.layoutService.onMenuToggle();
    }

    showRightMenu() {
        this.layoutService.toggleRightMenu();
    }

    onConfigButtonClick() {
        this.layoutService.showConfigSidebar();
    }

    logout() {
        this.authService.logout();
    }
}
