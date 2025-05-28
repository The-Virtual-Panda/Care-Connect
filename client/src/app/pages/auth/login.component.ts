import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '@/services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        CommonModule, RouterModule,
        InputTextModule, FormsModule,
        CheckboxModule, ButtonModule
    ],
    templateUrl: './login.component.html',
})
export class Login {
    private authService = inject(AuthService);

    email: string = '';

    password: string = '';

    remember: boolean = false;

    async login() {
        try {
            await this.authService.login(this.email, this.password);
            // Optionally, navigate or show a success message here
        } catch (error) {
            // Handle login error (e.g., show error message)
            console.error('Login failed', error);
        }
    }
}
