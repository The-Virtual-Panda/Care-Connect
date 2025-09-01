import { Shift } from '@/api/models/entity/shift';
import { TeamMember } from '@/api/models/entity/team-member';
import { AuthService } from '@/api/services/auth.service';
import { PhoneService } from '@/api/services/phone.service';
import { TeamService } from '@/api/services/team.service';
import { AppModal } from '@/components/app-modal.component';
import { OrgContextService } from '@/services/org-context.service';
import { ToastService } from '@/services/toast.service';
import { Logger } from '@/utils/logger';
import { Subscription } from 'rxjs';

import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';

import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { DatePicker } from 'primeng/datepicker';
import { DropdownModule } from 'primeng/dropdown';
import { DialogService } from 'primeng/dynamicdialog';
import { Fluid } from 'primeng/fluid';
import { IconFieldModule } from 'primeng/iconfield';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputIconModule } from 'primeng/inputicon';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressBarModule } from 'primeng/progressbar';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { Select } from 'primeng/select';
import { SelectModule } from 'primeng/select';
import { Skeleton } from 'primeng/skeleton';
import { SliderModule } from 'primeng/slider';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';

@Component({
    selector: 'cc-shifts-master',
    templateUrl: './shifts-master.component.html',
    standalone: true,
    imports: [
        TableModule,
        MultiSelectModule,
        SelectModule,
        InputIconModule,
        TagModule,
        InputTextModule,
        SliderModule,
        ProgressBarModule,
        ToggleButtonModule,
        CommonModule,
        FormsModule,
        ButtonModule,
        RatingModule,
        RippleModule,
        IconFieldModule,
        ToolbarModule,
        Skeleton,
        AppModal,
        InputGroupModule,
        InputGroupAddonModule,
        InputNumberModule,
        InputMaskModule,
        Fluid,
        Select,
        ReactiveFormsModule,
        MessageModule,
        ConfirmDialog,
        DatePicker,
        DropdownModule,
        InputSwitchModule,
        TooltipModule
    ],
    providers: [DialogService, ConfirmationService, PhoneService, TeamService]
})
export class ShiftsMasterComponent implements OnInit, OnDestroy {
    @Input() phoneId!: string;

    phoneService = inject(PhoneService);
    teamService = inject(TeamService);
    dialogService = inject(DialogService);
    formBuilder = inject(FormBuilder);
    confirmationService = inject(ConfirmationService);
    private toastService = inject(ToastService);
    private authService = inject(AuthService);
    private orgContextService = inject(OrgContextService);

    @ViewChild(AppModal) modal!: AppModal;

    shifts: Shift[] = [];
    selectedShifts: Shift[] = [];
    isLoading: boolean = true;
    timeRangeOptions = [
        { label: 'Future Shifts', value: 'future' },
        { label: 'Past Shifts', value: 'past' },
        { label: 'All Shifts', value: 'all' }
    ];

    // Table filters
    selectedTimeRange = { label: 'Future Shifts', value: 'future' };
    selectedAssignee: string | null = null;
    selectedDate: Date | null = null;

    shiftForm: FormGroup;
    submitted = false;
    isEditMode = false;

    teamMembers: TeamMember[] = [];
    timeZones: { label: string; value: string }[] = [
        { label: 'Eastern Time (America/New_York)', value: 'America/New_York' },
        { label: 'Central Time (America/Chicago)', value: 'America/Chicago' },
        { label: 'Mountain Time (America/Denver)', value: 'America/Denver' },
        { label: 'Pacific Time (America/Los_Angeles)', value: 'America/Los_Angeles' },
        { label: 'Alaska Time (America/Anchorage)', value: 'America/Anchorage' },
        { label: 'Hawaii-Aleutian Time (America/Adak)', value: 'America/Adak' },
        { label: 'Mountain Time - Arizona (America/Phoenix)', value: 'America/Phoenix' }
    ];

    private subscription: Subscription | null = null;
    private teamSubscription: Subscription | null = null;

    constructor() {
        this.shiftForm = this.formBuilder.group(
            {
                id: [''],
                assigneeId: ['', Validators.required],
                start: [null, [Validators.required, this.startDateValidator.bind(this)]],
                end: [null, Validators.required],
                enabled: [true],
                timeZone: ['America/Los_Angeles', Validators.required]
            },
            { validators: this.dateRangeValidator }
        );
    }

    ngOnInit(): void {
        if (!this.phoneId) {
            Logger.error('ShiftsMasterComponent: phoneId is required');
            return;
        }

        this.loadTeamMembers();
        this.reload();
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        if (this.teamSubscription) {
            this.teamSubscription.unsubscribe();
        }
    }

    loadTeamMembers(): void {
        const orgId = this.orgContextService.routeOrgId();
        this.teamSubscription = this.teamService.getTeamMembers(orgId).subscribe({
            next: (members) => {
                this.teamMembers = members;
            },
            error: (error) => {
                Logger.error('Error loading team members:', error);
                this.toastService.showError('Error', 'Failed to load team members.');
            }
        });
    }

    reload(): void {
        this.isLoading = true;

        this.subscription = this.phoneService.getPhoneShifts(this.phoneId).subscribe({
            next: (shifts) => {
                this.shifts = this.applyAllFilters(shifts);
                this.isLoading = false;
            },
            error: (error) => {
                this.isLoading = false;
                Logger.error('Error loading shifts:', error);
                this.toastService.showError('Error', 'Failed to load shifts. Please try again later.');
            }
        });
    }

    /**
     * Filters shifts based on the selected time segment
     */
    filterShiftsByTimeSegment(shifts: Shift[]): Shift[] {
        if (!shifts || !this.selectedTimeRange) {
            return shifts;
        }

        const now = new Date();

        switch (this.selectedTimeRange.value) {
            case 'past':
                // Past shifts have already ended
                return shifts.filter((shift) => {
                    const endDate = new Date(shift.end);
                    return endDate < now;
                });

            case 'future':
                // Future shifts haven't started yet
                return shifts.filter((shift) => {
                    const startDate = new Date(shift.start);
                    return startDate > now;
                });

            case 'all':
            default:
                return shifts;
        }
    }

    /**
     * Apply all filters (time range, assignee, date range) to the shifts
     */
    applyAllFilters(shifts: Shift[]): Shift[] {
        if (!shifts) {
            return [];
        }

        let filteredShifts = shifts;

        // Filter by assignee if one is selected
        if (this.selectedAssignee) {
            filteredShifts = filteredShifts.filter((shift) => shift.assigneeId === this.selectedAssignee);
        }

        // If a date is selected, ignore the time range filter
        if (!this.selectedDate) {
            filteredShifts = this.filterShiftsByTimeSegment(filteredShifts);
        } else {
            // Create a date range spanning the entire selected day (00:00:00 to 23:59:59)
            const startOfDay = new Date(this.selectedDate);
            startOfDay.setHours(0, 0, 0, 0);

            const endOfDay = new Date(this.selectedDate);
            endOfDay.setHours(23, 59, 59, 999);

            filteredShifts = filteredShifts.filter((shift) => {
                const shiftStart = new Date(shift.start);
                const shiftEnd = new Date(shift.end);

                // Show shift if any part of it occurs during the selected day
                return shiftStart <= endOfDay && shiftEnd >= startOfDay;
            });
        }

        return filteredShifts;
    }

    /**
     * Handle assignee selection change
     */
    onAssigneeChange(): void {
        this.reload();
    }

    /**
     * Handle date selection change
     */
    onDateFilter(): void {
        this.reload();
    }

    /**
     * Navigate the selected date forward or backward by the specified number of days
     * @param days Number of days to navigate (positive for forward, negative for backward)
     */
    navigateDate(days: number): void {
        if (!this.selectedDate) {
            // If no date is selected, use today as the base date
            this.selectedDate = new Date();
        } else {
            // Create a new date object to avoid directly mutating the bound property
            const newDate = new Date(this.selectedDate);
            // Add the specified number of days
            newDate.setDate(newDate.getDate() + days);
            this.selectedDate = newDate;
        }
        // Reload with the new date
        this.reload();
    }

    /**
     * Handle time range selection change
     */
    onTimeRangeChange(): void {
        this.reload();
    }

    refresh() {
        this.selectedShifts = [];
        this.reload();
    }

    resetFilters(table: Table<any>) {
        table.clear();
        this.selectedTimeRange = { label: 'Future Shifts', value: 'future' };
        this.selectedAssignee = null;
        this.selectedDate = null;
        this.reload();
    }

    addShift() {
        this.submitted = false;
        this.isEditMode = false;

        const defaultStart = this.getDefaultStartTime();

        this.shiftForm.reset({
            enabled: true,
            timeZone: 'America/Los_Angeles',
            start: defaultStart,
            end: null
        });

        this.modal.title = 'Add Shift';
        this.modal?.showModal();
    }

    editShift(shift: Shift) {
        this.submitted = false;
        this.isEditMode = true;

        this.shiftForm.patchValue({
            id: shift.id,
            assigneeId: shift.assigneeId,
            start: shift.start,
            end: shift.end,
            enabled: shift.enabled,
            timeZone: shift.timeZone
        });

        // Mark the form as pristine and untouched after patching values
        this.shiftForm.markAsPristine();
        this.shiftForm.markAsUntouched();

        this.modal.title = 'Edit Shift';
        this.modal?.showModal();
    }

    duplicateShift(shift: Shift) {
        this.submitted = false;
        this.isEditMode = false;

        this.shiftForm.patchValue({
            id: null, // Clear ID for new shift
            assigneeId: shift.assigneeId,
            start: shift.start,
            end: shift.end,
            enabled: shift.enabled,
            timeZone: shift.timeZone
        });

        this.shiftForm.markAsPristine();
        this.shiftForm.markAsUntouched();

        this.modal.title = 'Duplicate Shift';
        this.modal?.showModal();
    }

    onSubmitShift() {
        this.submitted = true;

        if (this.shiftForm.hasError('endBeforeStart') || this.shiftForm.get('start')?.hasError('startDateInvalid') || this.shiftForm.invalid) {
            return;
        }

        const shiftData = this.shiftForm.value;
        Logger.log('Saving shift data:', shiftData);

        this.isLoading = true;
        this.phoneService.saveShift(this.phoneId, shiftData).subscribe({
            next: () => {
                this.isLoading = false;
                this.modal.hideModal();
                this.toastService.showSuccess('Shift saved', 'The shift has been successfully saved.');
                this.reload();
            },
            error: (error: Error) => {
                this.isLoading = false;
                Logger.error('Error saving shift:', error);
                this.toastService.showError('Error', 'Failed to save shift. Please try again.');
            }
        });
    }

    isFieldInvalid(field: string): boolean {
        return this.submitted && (this.shiftForm.get(field)?.invalid || false);
    }

    confirmDelete() {
        if (!this.selectedShifts || this.selectedShifts.length === 0) return;

        this.confirmationService.confirm({
            message: `Are you sure you want to delete the selected shift${this.selectedShifts.length > 1 ? 's' : ''}?`,
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            rejectLabel: 'Cancel',
            rejectButtonProps: {
                label: 'Cancel',
                severity: 'secondary',
                outlined: true
            },
            acceptButtonProps: {
                label: 'Delete',
                severity: 'danger'
            },
            accept: () => {
                this.deleteSelectedShifts();
            }
        });
    }

    deleteSelectedShifts() {
        if (!this.selectedShifts || this.selectedShifts.length === 0) return;

        const ids = this.selectedShifts.map((s) => s.id);

        this.isLoading = true;
        this.phoneService.deleteShifts(this.phoneId, ids).subscribe({
            next: () => {
                this.isLoading = false;
                this.toastService.showSuccess('Shifts deleted', `${ids.length} shift${ids.length > 1 ? 's' : ''} deleted successfully!`);
                this.selectedShifts = [];
                this.reload();
            },
            error: (error) => {
                this.isLoading = false;
                Logger.error('Error deleting shifts:', error);
                this.toastService.showError('Error', 'Failed to delete shifts. Please try again.');
            }
        });
    }

    getAssigneeName(assigneeId: string): string {
        const member = this.teamMembers.find((m) => m.id === assigneeId);
        return member ? member.name : 'Unknown';
    }

    formatDateTime(date: Date): string {
        return date ? new Date(date).toLocaleString() : '';
    }

    formatTimeZone(timeZoneId: string): string {
        const timeZoneObj = this.timeZones.find((tz) => tz.value === timeZoneId);
        return timeZoneObj ? timeZoneObj.label.split(' (')[0] : timeZoneId;
    }

    // Custom validator to check that end date is after start date
    dateRangeValidator(group: AbstractControl): ValidationErrors | null {
        const start = group.get('start')?.value;
        const end = group.get('end')?.value;

        if (start && end && new Date(end) <= new Date(start)) {
            return { endBeforeStart: true };
        }

        return null;
    }

    // Custom validator for start date (not allowing current time for new shifts)
    startDateValidator(control: AbstractControl): ValidationErrors | null {
        if (!control.value || this.isEditMode) {
            return null;
        }

        const now = new Date();
        const startDate = new Date(control.value);

        // Allow if the date is in the future
        if (startDate > now) {
            return null;
        }

        return { startDateInvalid: true };
    }

    // Round date to nearest 15-minute interval
    roundToNearest15Minutes(date: Date): Date {
        const roundedDate = new Date(date);
        const minutes = roundedDate.getMinutes();
        const remainder = minutes % 15;
        roundedDate.setMinutes(minutes - remainder);
        roundedDate.setSeconds(0);
        roundedDate.setMilliseconds(0);
        return roundedDate;
    }

    // Get default start time (rounded to next 15-minute interval)
    getDefaultStartTime(): Date {
        const now = new Date();
        now.setMinutes(now.getMinutes() + 15); // Add 15 minutes to ensure it's in the future
        return this.roundToNearest15Minutes(now);
    }
}
