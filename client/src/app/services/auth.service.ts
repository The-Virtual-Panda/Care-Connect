import { inject, Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, User } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private auth: Auth = inject(Auth);
    private router = inject(Router);

    constructor() { }

    isLoggedIn() {
        return this.auth.currentUser !== null;
    }

    async login(email: string, password: string): Promise<User | null> {
        try {
            const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
            return userCredential.user;
        } catch (error) {
            // Handle error (e.g., invalid credentials)
            throw error;
        }
    }

    async logout() {
        await this.auth.signOut().then(() => {
            this.router.navigate(['/']);
        });
    }
}
