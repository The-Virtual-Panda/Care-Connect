import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { FileUpload } from 'primeng/fileupload';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    imports: [CommonModule, BadgeModule, TextareaModule, InputGroupModule, InputTextModule, InputGroupAddonModule, FileUpload, ButtonModule, DividerModule]
})
export class ProfileComponent {
    navs = [
        {
            label: 'Dashboard',
            icon: 'pi pi-th-large',
            to: ''
        },
        {
            label: 'Bookmarks',
            icon: 'pi pi-bookmark',
            to: ''
        },
        {
            label: 'Team',
            icon: 'pi pi-users',
            to: ''
        },
        {
            label: 'Messages',
            icon: 'pi pi-comments',
            badge: '2',
            to: ''
        }
    ];

    items = [
        {
            label: 'Profile',
            icon: 'pi pi-user'
        },
        {
            label: 'Account',
            icon: 'pi pi-cog'
        },
        {
            label: 'Appearance',
            icon: 'pi pi-palette'
        }
    ];

    selectedNav = 'Dashboard';
}
