import { Subscription } from 'rxjs';

import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { TeamMember } from '@/api/models/team-member';
import { TeamService } from '@/api/services/team.service';
import { AppAlert } from '@/layout/components/app-alert.component';
import { AppModal } from '@/layout/components/app-modal.component';
import { PhonePipe } from '@/pipes/phone.pipe';
import { Logger } from '@/utils/logger';

import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { DialogService } from 'primeng/dynamicdialog';
import { FloatLabel } from 'primeng/floatlabel';
import { Fluid } from 'primeng/fluid';
import { IconFieldModule } from 'primeng/iconfield';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputIconModule } from 'primeng/inputicon';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
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
    selector: 'cc-recipient-master',
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
        AppAlert,
        AppModal,
        InputGroupModule,
        InputGroupAddonModule,
        FloatLabel,
        InputNumberModule,
        InputMaskModule,
        Fluid,
        ReactiveFormsModule,
        MessageModule,
        ConfirmDialog,
        PhonePipe
    ],
    templateUrl: './recipient-master.component.html',
    standalone: true,
    providers: [MessageService, DialogService, ConfirmationService]
})
export class RecipientMasterComponent implements OnInit, OnDestroy {
    teamService = inject(TeamService);
    messageService = inject(MessageService);
    dialogService = inject(DialogService);
    formBuilder = inject(FormBuilder);
    confirmationService = inject(ConfirmationService);

    @ViewChild(AppAlert) alert: AppAlert | undefined;
    @ViewChild(AppModal) modal!: AppModal;

    teamMembers: TeamMember[] = [];
    selectedMembers: TeamMember[] = [];
    isLoading: boolean = true;
    searchQuery: string = '';

    recipientForm: FormGroup;
    submitted = false;

    private subscription: Subscription | null = null;

    constructor() {
        this.recipientForm = this.formBuilder.group({
            id: [''],
            name: ['', Validators.required],
            phoneNumber: ['', [Validators.required, this.phoneNumberValidator]],
            dateUpdated: [null],
            dateCreated: [null]
        });
    }

    // Custom validator that only validates complete phone numbers
    phoneNumberValidator(control: FormControl): { [key: string]: any } | null {
        const value = control.value;

        // If empty, let required validator handle it
        if (!value) return null;

        // Only validate if the input appears to be complete
        // Check if it has the full expected length including formatting characters
        if (value.length === 14) {
            // Format: (123) 456-7890 = 14 chars
            const phonePattern = /^\(\d{3}\)\s\d{3}-\d{4}$/;
            return phonePattern.test(value) ? null : { invalidFormat: true };
        }

        // For incomplete numbers, don't validate yet
        return null;
    }

    ngOnInit(): void {
        this.reload();
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    reload(): void {
        this.isLoading = true;
        this.alert?.close();

        this.subscription = this.teamService.getTeamMembers().subscribe({
            next: (members) => {
                this.teamMembers = members;
                this.isLoading = false;
            },
            error: (error) => {
                this.alert?.showError(`Failed to load team members: ${error.message}`);
                this.isLoading = false;
            }
        });
    }

    reset() {
        this.selectedMembers = [];
        this.reload();
    }

    clear(table: Table<any>) {
        table.clear();
        this.searchQuery = '';
    }

    onGlobalFilter(table: Table<any>, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    addRecipient() {
        this.submitted = false;
        this.recipientForm.reset();
        this.modal.title = 'Add Recipient';
        this.modal?.showModal();
    }

    editRecipient(member: TeamMember) {
        this.submitted = false;
        this.recipientForm.patchValue({
            id: member.id,
            name: member.name,
            phoneNumber: member.phoneNumber,
            dateUpdated: member.dateUpdated,
            dateCreated: member.dateCreated
        });

        // Mark the form as pristine and untouched after patching values
        // This prevents validation errors from showing immediately
        this.recipientForm.markAsPristine();
        this.recipientForm.markAsUntouched();

        this.modal.title = 'Edit Recipient';
        this.modal?.showModal();
    }

    onSubmitRecipient() {
        this.submitted = true;
        if (this.recipientForm.invalid) {
            return;
        }

        const recipientData = this.recipientForm.value;
        Logger.log('Saving recipient data:', recipientData);

        this.isLoading = true;
        this.teamService.saveRecipient(recipientData).subscribe({
            next: () => {
                this.modal.hideModal();
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Recipient saved successfully' });
                this.reload();
            },
            error: (error: Error) => {
                this.alert?.showError(`Failed to save recipient: ${error.message}`, 'Error adding recipient');
                this.isLoading = false;
            }
        });
    }

    // Helper method to check form control validity
    isFieldInvalid(field: string): boolean {
        const control = this.recipientForm.get(field);

        // Special handling for phone number
        if (field === 'phoneNumber') {
            // Only show validation errors if the form is submitted or
            // if the field is touched AND has a complete value (or empty)
            const value = control?.value || '';
            const isComplete = value.length === 0 || value.length === 14; // Empty or complete

            return (control?.invalid && ((control?.touched && isComplete) || this.submitted)) ?? false;
        }

        // Standard validation for other fields
        return (control?.invalid && (control?.touched || this.submitted)) ?? false;
    }

    confirmDelete() {
        this.confirmationService.confirm({
            // target: event.target as EventTarget,
            message: 'Do you want to delete the selected recipient(s)?',

            header: 'Danger Zone',
            icon: 'pi pi-info-circle',
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
                this.deleteSelectedMembers();
            }
        });
    }

    deleteSelectedMembers() {
        if (!this.selectedMembers || this.selectedMembers.length === 0) {
            return;
        }

        // Get the IDs of selected members
        const memberIds = this.selectedMembers.map((member) => member.id);
        this.isLoading = true;

        this.teamService.deleteRecipients(memberIds).subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Recipient(s) deleted successfully' });
                this.selectedMembers = [];
                this.reload();
            },
            error: (error: Error) => {
                this.alert?.showError(`Failed to delete recipient(s): ${error.message}`);
                this.isLoading = false;
            }
        });
    }
}
