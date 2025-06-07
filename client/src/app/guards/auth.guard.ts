import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.user$.pipe(
        map(user => {
            if (user) {
                console.log('User is authenticated:', user);
                return true;
            } else {
                console.log('User is not authenticated, redirecting to login');
                router.navigate(['/login']);
                return false;
            }
        })
    );
};
