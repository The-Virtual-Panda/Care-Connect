import { User } from '@/api/models/user';
import { UserService } from '@/api/services/user.service';
import { AppAlert } from '@/components/app-alert.component';
import { AppAvatarComponent } from '@/components/app-avatar.component';
import { Logger } from '@/utils/logger';

import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, computed, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

import { AuthService } from '@services/auth.service';

import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { FileUpload, FileUploadEvent } from 'primeng/fileupload';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { TextareaModule } from 'primeng/textarea';

export function noWhitespaceValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const isWhitespace = (control.value || '').trim().length === 0;
        return isWhitespace ? { whitespace: true } : null;
    };
}

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    imports: [
        FormsModule,
        CommonModule,
        ReactiveFormsModule,
        FileUpload,
        AvatarModule,
        TextareaModule,
        ButtonModule,
        InputGroupModule,
        InputTextModule,
        InputGroupAddonModule,
        AppAlert,
        MessageModule,
        AppAvatarComponent
    ]
})
export class ProfileComponent implements OnInit {
    authService = inject(AuthService);
    userService = inject(UserService);

    @ViewChild(AppAlert) alert: AppAlert | undefined;

    profileForm: FormGroup;
    formSubmitted = false;
    isLoadingProfile = true;

    userProfile = signal<User | null>(null);
    formValue = signal<{ name: string }>({ name: '' });

    isDirty = computed(() => {
        const user = this.userProfile();
        const formValue = this.formValue();

        if (!user) return false;

        if (user.name !== formValue.name) return true;

        return false;
    });

    constructor(private fb: FormBuilder) {
        this.profileForm = this.fb.group({
            name: ['', [Validators.required, noWhitespaceValidator()]]
        });

        this.profileForm.disable();

        // Subscribe to form changes and update the signal
        this.profileForm.valueChanges.subscribe((val) => {
            this.formValue.set(val);
        });
    }

    ngOnInit() {
        this.fetchUserProfile();
    }

    fetchUserProfile() {
        const userId = this.authService.userId();
        this.userService.getUserProfile(userId).subscribe({
            next: (profile) => {
                if (!profile) {
                    this.alert?.showError('Profile not found', 'No profile data available for the user.');
                    return;
                }

                this.userProfile.set(profile);
                this.profileForm.patchValue({
                    name: profile.name
                });
                this.profileForm.enable();
            },
            error: (err) => {
                this.alert?.showError('Failed to load user profile', err?.message || 'An error occurred');
            }
        });
    }

    isInvalid(controlName: string) {
        const control = this.profileForm.get(controlName);
        return control?.invalid && (control.touched || this.formSubmitted);
    }

    onBasicUploadAuto(event: FileUploadEvent) {
        const file = event.files[0];
        if (!file) {
            this.alert?.showError('No file selected for upload.');
            return;
        }

        this.userService.uploadProfileImage(this.authService.userId(), file).subscribe({
            next: (url) => this.fetchUserProfile(),
            error: (e) => Logger.error('Upload failed', e)
        });
    }

    updateProfile() {
        this.formSubmitted = true;
        this.alert?.close();

        if (this.profileForm.invalid) {
            this.alert?.showError('Invalid profile details', 'Please correct the errors in the form before submitting.');
            return;
        }

        const formValues = this.profileForm.value;
        Logger.log('Updating profile with:', formValues);

        this.userService.updateUserProfile(this.authService.userId(), formValues.name.trim()).subscribe({
            next: () => {
                this.alert?.showSuccess('Your profile has been updated');
                this.userProfile.update((user) => (user ? { ...user, name: formValues.name.trim() } : user));
                this.profileForm.reset({
                    name: formValues.name.trim()
                });
            },
            error: (err) => {
                this.alert?.showError('Failed to update profile', err?.message || 'An error occurred');
            }
        });
    }
}
