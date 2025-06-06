import { Component, ViewChild } from '@angular/core';
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { CheckboxModule } from "primeng/checkbox";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { AppAlert } from '@/layout/components/app.alert';
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

    username = '';
    email = '';
    password = '';
    confirmPassword = '';
    checkbox = false;

    constructor(private authService: AuthService) { }

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

        try {
            await this.authService.register(this.email, this.password);
            this.alert.showSuccess('Registration successful!', 'Success');
        } catch (error: any) {
            this.alert.showError(error?.message || 'Registration failed.', 'Registration Error');
        }
    }
}
