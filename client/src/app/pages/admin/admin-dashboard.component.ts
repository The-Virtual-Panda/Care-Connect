import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TabsModule } from 'primeng/tabs';

@Component({
    selector: 'app-admin-dashboard',
    imports: [TabsModule, RouterModule],
    templateUrl: './admin-dashboard.component.html'
})
export class AdminDashboard {
    tabs = [
        { label: 'Organizations', icon: 'pi pi-building', route: 'orgs' },
        { label: 'System Users', icon: 'pi pi-users', route: 'system-users' }
    ];
}
