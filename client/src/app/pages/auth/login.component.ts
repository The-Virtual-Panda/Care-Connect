import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '@/services/auth.service';
import { AppAlert } from '@/layout/components/app-alert.component';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        CommonModule, RouterModule,
        InputTextModule, FormsModule,
        CheckboxModule, ButtonModule,
        AppAlert
    ],
    templateUrl: './login.component.html',
})
export class Login {
    private authService = inject(AuthService);
    private router = inject(Router);

    @ViewChild(AppAlert) alert!: AppAlert;

    email: string = '';
    password: string = '';
    remember: boolean = false;

    async login() {
        console.log('Login attempt with:', this.email, this.password);
        if (!this.email || !this.password) {
            this.alert.showError('Email and password are required.', 'Validation Error');
            return;
        }

        try {
            await this.authService.login(this.email, this.password);
            this.router.navigateByUrl('/');
        } catch (error: any) {
            // Use the AppAlert component to show the error
            this.alert.showError(error?.message || 'Login failed. Please try again.', 'Login Error');
        }
    }
}
