import { inject, Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, User, createUserWithEmailAndPassword, onAuthStateChanged } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private auth: Auth = inject(Auth);
    private router = inject(Router);

    // Observable for auth state
    private userSubject = new BehaviorSubject<User | null>(null);
    user$: Observable<User | null> = this.userSubject.asObservable();

    constructor() {
        onAuthStateChanged(this.auth, (user) => {
            this.userSubject.next(user);
        });
    }

    isLoggedIn(): boolean {
        return this.userSubject.value !== null;
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

    async register(email: string, password: string): Promise<User | null> {
        try {
            const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
            return userCredential.user;
        } catch (error) {
            // Handle error (e.g., email already in use)
            throw error;
        }
    }

    async logout() {
        await this.auth.signOut().then(() => {
            this.router.navigate(['/']);
        });
    }
}
