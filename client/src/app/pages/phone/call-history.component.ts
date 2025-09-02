import { TwilioCall, TwilioCallSearchOptions, TwilioCallStatus } from '@/api/models/dto/twilio-calls';
import { TwilioService } from '@/api/services/twilio.service';
import { AppAlert } from '@/components/app-alert.component';
import { OrgContextService } from '@/services/org-context.service';
import { Subscription } from 'rxjs';

import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { SkeletonModule } from 'primeng/skeleton';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToolbarModule } from 'primeng/toolbar';

@Component({
    selector: 'app-call-history',
    imports: [
        CommonModule,
        FormsModule,
        TableModule,
        SelectModule,
        ToolbarModule,
        ButtonModule,
        InputTextModule,
        SkeletonModule,
        MessageModule,
        IconFieldModule,
        TagModule,
        AppAlert,
        InputIconModule,
        DatePickerModule
    ],
    templateUrl: './call-history.component.html',
    providers: [TwilioService]
})
export class CallHistoryComponent implements OnInit, OnDestroy {
    private twilioService = inject(TwilioService);
    private orgContextService = inject(OrgContextService);

    @ViewChild(AppAlert) alert: AppAlert | undefined;

    calls: TwilioCall[] = [];
    isLoading = true;

    toFilter: string | null = null;
    fromFilter: string | null = null;
    selectedStatus: TwilioCallStatus | null = null;
    statusOptions: { label: string; value: TwilioCallStatus }[] = [
        { label: 'Busy', value: 'busy' },
        { label: 'Canceled', value: 'canceled' },
        { label: 'Completed', value: 'completed' },
        { label: 'Failed', value: 'failed' },
        { label: 'In Progress', value: 'in-progress' },
        { label: 'No Answer', value: 'no-answer' },
        { label: 'Queued', value: 'queued' },
        { label: 'Ringing', value: 'ringing' }
    ];
    customDateRange: Date[] | null = null; // [start, end]
    selectedDateRangeOption: Date[] | null = null;
    dateRangeOptions: { label: string; value: Date[] | undefined }[] = [
        {
            label: 'Today',
            value: [new Date(), new Date()]
        },
        {
            label: 'Last 7 Days',
            value: [new Date(new Date().setDate(new Date().getDate() - 7)), new Date()]
        },
        {
            label: 'Last 30 Days',
            value: [new Date(new Date().setDate(new Date().getDate() - 30)), new Date()]
        },
        {
            label: 'Custom Range',
            value: undefined
        }
    ];

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

        // Prefer predefined selected range when it has a value; otherwise use custom range
        const activeRange = this.selectedDateRangeOption?.length ? this.selectedDateRangeOption : this.customDateRange;

        const searchOptions: TwilioCallSearchOptions = {
            orgId: orgId,
            status: this.selectedStatus || undefined,
            from: this.fromFilter || undefined,
            to: this.toFilter || undefined,
            startDate: activeRange?.[0] ? this.createZeroedDateString(activeRange[0]) : undefined,
            endDate: activeRange?.[1] ? this.createZeroedDateString(activeRange[1]) : activeRange?.[0] ? this.createZeroedDateString(activeRange[0]) : undefined
        };

        this.calls = [];
        this.subscription = this.twilioService.getCallHistory(searchOptions).subscribe({
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
        this.selectedDateRangeOption = null;
        this.selectedStatus = null;
        this.customDateRange = null;
        this.fromFilter = null;
        this.toFilter = null;
        table.clear();
        this.reload();
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

    createZeroedDateString(date: Date): string | undefined {
        if (!date) return undefined;

        const zeroedDate = new Date(date);
        zeroedDate.setHours(0, 0, 0, 0);
        return zeroedDate.toISOString();
    }

    onChangeDebounce() {
        clearTimeout((this as any)._debounceTimeout);
        (this as any)._debounceTimeout = setTimeout(() => {
            this.reload();
        }, 2000);
    }
}
