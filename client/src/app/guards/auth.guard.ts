import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const isAuthenticated = authService.isLoggedIn();

    if (!isAuthenticated) {
        // Redirect to the login page if not authenticated
        router.navigate(['/login']);
        return false;
    }

    return true;
};
