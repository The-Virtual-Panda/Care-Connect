import { AuthService } from '@/api/services/auth.service';
import { AuthResult } from '@/api/services/auth.service';
import { AppAlert } from '@/components/app-alert.component';
import { OrgContextService } from '@/services/org-context.service';
import { Logger } from '@/utils/logger';

import { CommonModule } from '@angular/common';
import { Component, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

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
    private orgContextService = inject(OrgContextService);

    @ViewChild(AppAlert) alert!: AppAlert;

    email: string = '';
    password: string = '';
    remember: boolean = false;

    login() {
        Logger.log('Login attempt with:', this.email, this.password);
        if (!this.email || !this.password) {
            this.alert.showError('Email and password are required.', 'Validation Error');
            return;
        }

        this.authService.login(this.email, this.password).subscribe({
            next: (authResult: AuthResult) => {
                const defaultOrgId = authResult.profile?.defaultOrgId;

                if (!defaultOrgId) {
                    // TODO: Need to navigate to the no-org onboarding page
                    this.alert.showError('No default organization found.', 'Login Error');
                    this.router.navigateByUrl('/');
                    return;
                }

                this.orgContextService.switch(defaultOrgId);
            },
            error: (error: Error) => {
                // Use the AppAlert component to show the error
                this.alert.showError(error?.message || 'Login failed. Please try again.', 'Login Error');
            }
        });
    }
}
