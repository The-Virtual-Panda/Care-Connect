import { AdminService } from '@/api/services/admin.service';
import { Subscription } from 'rxjs';

import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Organization } from '@models/organization';

import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
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
    selector: 'app-orgs',
    templateUrl: './orgs.component.html',
    providers: [MessageService],
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
    ]
})
export class OrgsComponent implements OnInit, OnDestroy {
    private adminService = inject(AdminService);
    private messageService = inject(MessageService);

    orgs: Organization[] = [];
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
        const subscription = this.adminService.getAllOrgs().subscribe({
            next: (orgs) => {
                this.orgs = orgs;
                this.isLoading = false;
            },
            error: (error) => {
                console.error('Error loading organizations:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to load organizations. Please try again.'
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
