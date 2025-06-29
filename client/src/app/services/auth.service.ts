import { inject, Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, User, createUserWithEmailAndPassword, onAuthStateChanged, AuthError } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, from, map, Observable, take, throwError } from 'rxjs';

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

    isLoggedIn(): Observable<boolean> {
        return this.user$.pipe(
            map(user => user !== null),
            take(1)
        );
    }

    async login(email: string, password: string): Promise<User | null> {
        try {
            const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
            // Store the user info in the subject
            this.userSubject.next(userCredential.user);
            return userCredential.user;
        } catch (error) {
            // Handle error (e.g., invalid credentials)
            throw error;
        }
    }

    register(email: string, password: string): Observable<User> {
        return from(createUserWithEmailAndPassword(this.auth, email, password)).pipe(
            map(userCredential => {
                this.userSubject.next(userCredential.user);
                return userCredential.user;
            }),
            catchError((error: AuthError) => {
                let errorMessage: string;

                switch (error.code) {
                    case 'auth/email-already-in-use':
                        errorMessage = 'This email is already registered.';
                        break;
                    case 'auth/invalid-email':
                        errorMessage = 'The email address is not valid.';
                        break;
                    case 'auth/weak-password':
                        errorMessage = 'Password is too weak.';
                        break;
                    default:
                        errorMessage = 'An unexpected error occurred.';
                }

                return throwError(() => new Error(errorMessage));
            })
        );
    }

    async logout() {
        await this.auth.signOut().then(() => {
            window.location.href = '/';
        });
    }
}
