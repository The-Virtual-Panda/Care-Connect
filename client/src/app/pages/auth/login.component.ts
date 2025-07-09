import { firstValueFrom } from 'rxjs';

import { CommonModule } from '@angular/common';
import { Component, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { AuthService } from '@/api/services/auth.service';
import { AppAlert } from '@/layout/components/app-alert.component';
import { Logger } from '@/utils/logger';

import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, RouterModule, InputTextModule, FormsModule, CheckboxModule, ButtonModule, AppAlert],
    templateUrl: './login.component.html'
})
export class Login {
    private authService = inject(AuthService);
    private router = inject(Router);

    @ViewChild(AppAlert) alert!: AppAlert;

    email: string = '';
    password: string = '';
    remember: boolean = false;

    login() {
        Logger.debug('Login attempt with:', this.email, this.password);
        if (!this.email || !this.password) {
            this.alert.showError('Email and password are required.', 'Validation Error');
            return;
        }

        this.authService.login(this.email, this.password).subscribe({
            next: () => {
                this.router.navigateByUrl('/');
            },
            error: (error: Error) => {
                // Use the AppAlert component to show the error
                this.alert.showError(error?.message || 'Login failed. Please try again.', 'Login Error');
            }
        });
    }
}
