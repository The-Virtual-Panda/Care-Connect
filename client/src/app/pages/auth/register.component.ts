import { Component, ViewChild } from '@angular/core';
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { CheckboxModule } from "primeng/checkbox";
import { FormsModule } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { AppAlert } from '@/layout/components/app-alert.component';
import { AuthService } from '@/services/auth.service';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [
        ButtonModule,
        InputTextModule,
        CheckboxModule,
        FormsModule,
        RouterModule,
        AppAlert
    ],
    templateUrl: './register.component.html',
})
export class Register {
    @ViewChild(AppAlert) alert!: AppAlert;

    orgName = '';
    name = '';
    email = '';
    password = '';
    confirmPassword = '';
    checkbox = false;

    constructor(private authService: AuthService, private router: Router) { }

    async register() {
        if (!this.email || !this.password || !this.confirmPassword) {
            this.alert.showError('All fields are required.', 'Registration Error');
            return;
        }
        // Simple email regex for demonstration
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(this.email)) {
            this.alert.showError('Please enter a valid email address.', 'Registration Error');
            return;
        }

        if (this.password !== this.confirmPassword) {
            this.alert.showError('Passwords do not match.', 'Whoops!');
            return;
        }

        // Subscribe to the observable
        this.authService.registerSelf(this.email, this.password, this.name, this.orgName)
            .subscribe({
                next: (result) => {
                    // Log the registration details (for debugging)
                    console.log('Registration successful:', result);

                    // Include some details in the success message
                    this.alert.showSuccess(
                        `Registration successful! Your account and organization have been created. You will be redirected in a few seconds.`,
                        'Success'
                    );

                    // Set a timer to redirect after 3 seconds
                    setTimeout(() => {
                        this.router.navigate(['/']);
                    }, 3000);
                },
                error: (error) => {
                    this.alert.showError(error?.message || 'Registration failed.', 'Registration Error');
                }
            });
    }
}
