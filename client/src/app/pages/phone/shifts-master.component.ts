import { Subscription } from 'rxjs';

import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';

import { Shift } from '@/api/models/shift';
import { TeamMember } from '@/api/models/team-member';
import { PhoneService } from '@/api/services/phone.service';
import { TeamService } from '@/api/services/team.service';
import { AppModal } from '@/layout/components/app-modal.component';
import { Logger } from '@/utils/logger';

import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { ConfirmDialog } from 'primeng/confirmdialog';
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
import { SelectModule } from 'primeng/select';
import { Skeleton } from 'primeng/skeleton';
import { SliderModule } from 'primeng/slider';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToolbarModule } from 'primeng/toolbar';

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
        ToastModule,
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
        ReactiveFormsModule,
        MessageModule,
        ConfirmDialog,
        CalendarModule,
        DropdownModule,
        InputSwitchModule
    ],
    providers: [MessageService, DialogService, ConfirmationService]
})
export class ShiftsMasterComponent implements OnInit, OnDestroy {
    @Input() phoneId!: string;

    phoneService = inject(PhoneService);
    teamService = inject(TeamService);
    messageService = inject(MessageService);
    dialogService = inject(DialogService);
    formBuilder = inject(FormBuilder);
    confirmationService = inject(ConfirmationService);

    @ViewChild(AppModal) modal!: AppModal;

    shifts: Shift[] = [];
    selectedShifts: Shift[] = [];
    isLoading: boolean = true;
    searchQuery: string = '';

    shiftForm: FormGroup;
    submitted = false;
    isEditMode = false;

    teamMembers: TeamMember[] = [];
    timeZones: { label: string; value: string }[] = [
        { label: 'America/New_York (Eastern Time)', value: 'America/New_York' },
        { label: 'America/Chicago (Central Time)', value: 'America/Chicago' },
        { label: 'America/Denver (Mountain Time)', value: 'America/Denver' },
        { label: 'America/Los_Angeles (Pacific Time)', value: 'America/Los_Angeles' },
        { label: 'America/Anchorage (Alaska Time)', value: 'America/Anchorage' },
        { label: 'America/Adak (Hawaii-Aleutian Time)', value: 'America/Adak' },
        { label: 'America/Phoenix (Mountain Time - Arizona)', value: 'America/Phoenix' }
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
        this.teamSubscription = this.teamService.getTeamMembers().subscribe({
            next: (members) => {
                this.teamMembers = members;
            },
            error: (error) => {
                Logger.error('Error loading team members:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to load team members.'
                });
            }
        });
    }

    reload(): void {
        this.isLoading = true;

        this.subscription = this.phoneService.getPhoneShifts(this.phoneId).subscribe({
            next: (shifts) => {
                this.shifts = shifts;
                this.isLoading = false;
            },
            error: (error) => {
                this.isLoading = false;
                Logger.error('Error loading shifts:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to load shifts. Please try again later.'
                });
            }
        });
    }

    reset() {
        this.selectedShifts = [];
        this.reload();
    }

    clear(table: Table<any>) {
        table.clear();
        this.searchQuery = '';
    }

    onGlobalFilter(table: Table<any>, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
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
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Shift saved successfully!'
                });
                this.reload();
            },
            error: (error: Error) => {
                this.isLoading = false;
                Logger.error('Error saving shift:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to save shift. Please try again.'
                });
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
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: `${ids.length} shift${ids.length > 1 ? 's' : ''} deleted successfully!`
                });
                this.selectedShifts = [];
                this.reload();
            },
            error: (error) => {
                this.isLoading = false;
                Logger.error('Error deleting shifts:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to delete shifts. Please try again.'
                });
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
