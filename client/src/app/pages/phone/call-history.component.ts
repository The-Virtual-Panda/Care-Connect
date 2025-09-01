import { TwilioCall, TwilioCallStatus } from '@/api/models/dto/twilio-calls';
import { TwilioService } from '@/api/services/twilio.service';
import { AppAlert } from '@/components/app-alert.component';
import { OrgContextService } from '@/services/org-context.service';
import { Subscription } from 'rxjs';

import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SkeletonModule } from 'primeng/skeleton';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToolbarModule } from 'primeng/toolbar';

@Component({
    selector: 'app-call-history',
    imports: [CommonModule, FormsModule, TableModule, ToolbarModule, ButtonModule, InputTextModule, SkeletonModule, MessageModule, TagModule, AppAlert],
    templateUrl: './call-history.component.html',
    styles: ``
})
export class CallHistoryComponent implements OnInit, OnDestroy {
    private twilioService = inject(TwilioService);
    private orgContextService = inject(OrgContextService);

    @ViewChild(AppAlert) alert: AppAlert | undefined;

    calls: TwilioCall[] = [];
    isLoading = true;
    private subscription: Subscription | null = null;

    ngOnInit(): void {
        this.reload();
    }

    ngOnDestroy(): void {
        this.subscription?.unsubscribe();
    }

    reload(): void {
        this.isLoading = true;
        this.alert?.close();
        const orgId = this.orgContextService.routeOrgId();

        if (!orgId) {
            this.alert?.showError('No organization ID found. Cannot retrieve call history.');
            this.isLoading = false;
            return;
        }

        this.subscription = this.twilioService.getCallHistory({ orgId }).subscribe({
            next: (response) => {
                this.calls = response.calls;
                this.isLoading = false;
            },
            error: (err) => {
                this.alert?.showError(`Failed to load call history: ${err.message}`);
                this.isLoading = false;
            }
        });
    }

    clearFilters(table: Table): void {
        table.clear();
    }

    onGlobalFilter(table: Table, event: Event): void {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    formatDirection(direction: string): string {
        switch (direction) {
            case 'inbound':
                return 'Incoming';
            case 'outbound-api':
                return 'Outgoing (API)';
            case 'outbound-dial':
                return 'Outgoing (Dial)';
            default:
                return direction;
        }
    }

    getDirectionIcon(direction: string): string {
        switch (direction) {
            case 'inbound':
                return 'pi pi-arrow-down';
            case 'outbound-api':
            case 'outbound-dial':
                return 'pi pi-arrow-up';
            default:
                return 'pi pi-question';
        }
    }

    getDirectionClass(direction: string): string {
        switch (direction) {
            case 'inbound':
                return 'text-green-500';
            case 'outbound-api':
            case 'outbound-dial':
                return 'text-blue-500';
            default:
                return '';
        }
    }

    formatDuration(seconds?: number): string {
        if (seconds === undefined || seconds === null) return '--';

        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;

        if (minutes === 0) {
            return `${remainingSeconds}s`;
        }

        return `${minutes}m ${remainingSeconds}s`;
    }

    getStatusSeverity(status: TwilioCallStatus): string {
        switch (status) {
            case 'completed':
                return 'success';
            case 'in-progress':
                return 'info';
            case 'ringing':
            case 'queued':
                return 'warning';
            case 'busy':
            case 'failed':
            case 'no-answer':
            case 'canceled':
                return 'danger';
            default:
                return 'secondary';
        }
    }

    formatPrice(price?: number | null): string {
        if (price == null || Math.abs(price) === 0) return '-';

        return '$' + Math.abs(price);
    }
}
