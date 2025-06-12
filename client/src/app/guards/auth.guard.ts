import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { map, take } from 'rxjs/operators';
import { authState } from '@angular/fire/auth';

export const AuthGuard: CanActivateFn = (route, state) => {
    const auth = inject(Auth);
    const router = inject(Router);

    return authState(auth).pipe(
        take(1),
        map(user => {
            // If user is logged in, allow access
            if (user) {
                return true;
            }

            // If not logged in, redirect to login page
            router.navigate(['/login']);
            return false;
        })
    );
};
