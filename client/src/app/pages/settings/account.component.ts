import { AuthService } from '@/api/services/auth.service';
import { UserService } from '@/api/services/user.service';
import { AppAlert } from '@/components/app-alert.component';

import { CommonModule } from '@angular/common';
import { Component, ViewChild, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { TextareaModule } from 'primeng/textarea';

import { ChangeBlogOptComponent } from './change-blog-opt.component';
import { noWhitespaceValidator } from './profile.component';

@Component({
    selector: 'app-account',
    templateUrl: './account.component.html',
    imports: [
        AppAlert,
        CommonModule,
        TextareaModule,
        InputGroupModule,
        InputTextModule,
        FormsModule,
        CommonModule,
        ReactiveFormsModule,
        TextareaModule,
        ButtonModule,
        InputGroupModule,
        InputTextModule,
        InputGroupAddonModule,
        AppAlert,
        MessageModule,
        ButtonModule,
        DividerModule,
        ChangeBlogOptComponent
    ]
})
export class AccountComponent {
    authService = inject(AuthService);
    userService = inject(UserService);

    @ViewChild(AppAlert) alert: AppAlert | undefined;

    passwordForm: FormGroup;
    formSubmitted = false;
    formValue = signal<{ currentPassword: string; newPassword: string; confirmPassword: string }>({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    isDirty = computed(() => {
        const formValue = this.formValue();

        if (formValue.currentPassword) return true;

        return false;
    });

    constructor(private fb: FormBuilder) {
        this.passwordForm = this.fb.group(
            {
                currentPassword: ['', [Validators.required, noWhitespaceValidator()]],
                newPassword: ['', [Validators.required, noWhitespaceValidator()]],
                confirmPassword: ['', [Validators.required, noWhitespaceValidator()]]
            },
            { validators: AccountComponent.passwordsMatchValidator }
        );

        this.passwordForm.valueChanges.subscribe((val: any) => {
            this.formValue.set(val);
        });
    }

    ngOnInit() {}

    // Custom validator to check if newPassword and confirmPassword match
    static passwordsMatchValidator(form: FormGroup): null | { passwordsMismatch: boolean } {
        const newPassword = form.get('newPassword')?.value;
        const confirmPassword = form.get('confirmPassword')?.value;

        if (newPassword && confirmPassword && newPassword !== confirmPassword) {
            return { passwordsMismatch: true };
        }

        return null;
    }

    isInvalid(controlName: string) {
        const control = this.passwordForm.get(controlName);

        // For confirmPassword, also check for form-level mismatch error
        if (controlName === 'confirmPassword') {
            return (
                (control?.invalid && (control.touched || this.formSubmitted)) ||
                (this.passwordForm.errors?.['passwordsMismatch'] && (control?.touched || this.formSubmitted))
            );
        }
        return control?.invalid && (control.touched || this.formSubmitted);
    }

    updatePassword() {
        this.formSubmitted = true;
        this.alert?.close();

        if (this.passwordForm.invalid) {
            this.alert?.showError('Please correct the errors in the form before submitting.');
            return;
        }

        const formValue = this.formValue();

        this.authService.changePassword(formValue.currentPassword, formValue.newPassword).subscribe({
            next: () => {
                this.alert?.showSuccess('Password changed successfully');
                this.formValue.set({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
                this.passwordForm.reset();
                this.formSubmitted = false;
            },
            error: (err) => {
                this.alert?.showError('Failed to change password', err?.message || 'An error occurred');
            }
        });
    }
}
