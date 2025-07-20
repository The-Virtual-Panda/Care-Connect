import { Organization } from '@/api/models/organization';
import { User } from '@/api/models/user';
import { AdminService } from '@/api/services/admin.service';
import { Subscription } from 'rxjs';

import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { Fluid } from 'primeng/fluid';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SkeletonModule } from 'primeng/skeleton';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

import { OrgsMembershipListComponent } from './components/org-membership-list.component';

@Component({
    selector: 'app-system-users',
    templateUrl: './system-users-master.component.html',
    standalone: true,
    imports: [
        CommonModule,
        InputIconModule,
        FormsModule,
        TableModule,
        ToastModule,
        ButtonModule,
        InputTextModule,
        SelectButtonModule,
        SkeletonModule,
        TooltipModule,
        IconFieldModule,
        OrgsMembershipListComponent
    ],
    providers: [MessageService]
})
export class SystemUsersComponent implements OnInit, OnDestroy {
    private adminService = inject(AdminService);
    private messageService = inject(MessageService);

    systemUsers: User[] = [];
    isLoading = true;
    searchTerm = '';

    private subscriptions: Subscription[] = [];

    ngOnInit(): void {
        this.reload();
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach((sub) => sub.unsubscribe());
    }

    reload(): void {
        this.isLoading = true;
        const subscription = this.adminService.getAllUsers().subscribe({
            next: (users) => {
                this.systemUsers = users;
                this.isLoading = false;
            },
            error: (error) => {
                console.error('Error loading users:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to load users. Please try again.'
                });
                this.isLoading = false;
            }
        });

        this.subscriptions.push(subscription);
    }

    clearFilters(table: Table): void {
        table.clear();
        this.searchTerm = '';
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
}
