import { Organization } from '@/api/models/entity/organization';
import { AdminService } from '@/api/services/admin.service';
import { OrgContextService } from '@/services/org-context.service';
import { ToastService } from '@/services/toast.service';
import { Logger } from '@/utils/logger';
import { Subscription } from 'rxjs';

import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SkeletonModule } from 'primeng/skeleton';
import { Table, TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';

import { OrgsMembershipListComponent } from './components/org-membership-list.component';

@Component({
    selector: 'app-orgs',
    templateUrl: './orgs-master.component.html',
    imports: [
        CommonModule,
        InputIconModule,
        FormsModule,
        TableModule,
        ButtonModule,
        InputTextModule,
        SelectButtonModule,
        SkeletonModule,
        TooltipModule,
        IconFieldModule,
        OrgsMembershipListComponent
    ],
    providers: [AdminService]
})
export class OrgsComponent implements OnInit, OnDestroy {
    private adminService = inject(AdminService);
    private toastService = inject(ToastService);
    orgContextService = inject(OrgContextService);

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
                Logger.error('Error loading organizations:', error);
                this.toastService.showError('Error', 'Failed to load organizations. Please try again.');
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
