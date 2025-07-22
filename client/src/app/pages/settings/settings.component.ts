import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';

import { AppConfigurator } from './app.configurator';
import { ProfileComponent } from './profile.component';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    imports: [
        CommonModule,
        ProfileComponent,
        BadgeModule,
        TextareaModule,
        InputGroupModule,
        InputTextModule,
        InputGroupAddonModule,
        ButtonModule,
        DividerModule,
        AppConfigurator
    ]
})
export class SettingsComponent {
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

    selectedTab = 0;
}
