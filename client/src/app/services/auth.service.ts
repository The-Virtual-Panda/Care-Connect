import { inject, Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, User, createUserWithEmailAndPassword, onAuthStateChanged, AuthError } from '@angular/fire/auth';
import { BehaviorSubject, catchError, from, map, Observable, switchMap, take, throwError } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private auth: Auth = inject(Auth);
    private userService = inject(UserService);

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

    login(email: string, password: string): Observable<User> {
        return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
            map(userCredential => {
                this.userSubject.next(userCredential.user);
                return userCredential.user;
            }),
            catchError((error: AuthError) => {
                let errorMessage: string;

                switch (error.code) {
                    case 'auth/user-not-found':
                    case 'auth/wrong-password':
                    case 'auth/invalid-credential':
                        errorMessage = 'Invalid email or password. Please try again.';
                        break;
                    case 'auth/user-disabled':
                        errorMessage = 'This account has been disabled. Please contact support.';
                        break;
                    case 'auth/too-many-requests':
                        errorMessage = 'Too many failed login attempts. Please try again later.';
                        break;
                    case 'auth/invalid-email':
                        errorMessage = 'Please enter a valid email address.';
                        break;
                    default:
                        errorMessage = 'Login failed. Please try again.';
                }

                return throwError(() => new Error(errorMessage));
            })
        );
    }

    registerSelf(email: string, password: string, name: string, orgName: string): Observable<{ userId: string, orgId: string }> {
        return from(createUserWithEmailAndPassword(this.auth, email, password)).pipe(
            switchMap(userCredential => {
                this.userSubject.next(userCredential.user);
                // Now call userService to create the user profile
                return this.userService.createUserAndOrg(
                    userCredential.user.uid,
                    email,
                    name,
                    orgName
                );
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

                console.log('Registration error:', error);

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
