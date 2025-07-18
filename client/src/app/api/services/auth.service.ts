import { BehaviorSubject, Observable, catchError, from, map, switchMap, throwError } from 'rxjs';

import { Injectable, inject } from '@angular/core';
import { Auth, AuthError, User as FireUser, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword } from '@angular/fire/auth';
import { docData } from '@angular/fire/firestore';

import { Organization } from '@/api/models/organization';
import { User } from '@/api/models/user';
import { Logger } from '@/utils/logger';

import { FirestoreCollectionsService } from './firestore-collections';
import { UserService } from './user.service';

// Extended user context with more than just Firebase auth user
export interface AuthResult {
    profile: User | null;
    currentOrganization: Organization | null;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    public static readonly USER_SESSION_KEY = 'user-session';

    private auth: Auth = inject(Auth);
    private userService = inject(UserService);
    private firestoreCollections = inject(FirestoreCollectionsService);

    // Observable for auth state
    private userSubject = new BehaviorSubject<FireUser | null>(null);
    user$: Observable<FireUser | null> = this.userSubject.asObservable();

    private _userSession: AuthResult | null = null;
    private _debugAuth = false;

    constructor() {
        // Try to restore session from localStorage
        this.fetchUserSession();

        onAuthStateChanged(this.auth, (user) => {
            if (this._debugAuth) Logger.log('Auth state changed:', user);
            this.userSubject.next(user);

            // If user logged in, fetch extended profile
            if (user && this._userSession == null) {
                // Load user context from Firestore
                this.loadUserContext(user).subscribe({
                    next: (session) => {
                        if (this._debugAuth) Logger.log('User context loaded from auth state change:', session);
                    },
                    error: (err) => {
                        Logger.error('Failed to load user context on auth state change:', err);
                    }
                });
            } else if (!user) {
                // User logged out or session expired, clear session
                this.deleteUserSession();
            }
        });
    }

    isLoggedIn(): boolean {
        this.fetchUserSession();
        return this._userSession != null;
    }

    login(email: string, password: string): Observable<AuthResult> {
        return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
            switchMap((userCredential) => {
                this.userSubject.next(userCredential.user);
                // Load full user context and return that instead of just the Firebase user
                return this.loadUserContext(userCredential.user);
            }),
            catchError((error: AuthError | Error) => {
                let errorMessage: string;

                if ('code' in error) {
                    // Firebase Auth error
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
                } else {
                    // Context loading error
                    errorMessage = error.message || 'Failed to load user profile. Please try again.';
                }

                return throwError(() => new Error(errorMessage));
            })
        );
    }

    registerSelf(email: string, password: string, name: string, orgName: string): Observable<AuthResult> {
        return from(createUserWithEmailAndPassword(this.auth, email, password)).pipe(
            switchMap((userCredential) => {
                this.userSubject.next(userCredential.user);
                // Now call userService to create the user profile
                return this.userService.createUserAndOrg(userCredential.user.uid, email, name, orgName).pipe(
                    // After creating user and org, load the full user context
                    switchMap(() => this.loadUserContext(userCredential.user))
                );
            }),
            catchError((error: AuthError | Error) => {
                let errorMessage: string;

                if ('code' in error) {
                    // Firebase Auth error
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
                            errorMessage = 'An unexpected error occurred during registration.';
                    }
                } else {
                    // Context loading error
                    errorMessage = error.message || 'Failed to complete registration. Please try again.';
                }

                if (this._debugAuth) Logger.log('Registration error:', error);

                return throwError(() => new Error(errorMessage));
            })
        );
    }

    async logout() {
        await this.auth.signOut().then(() => {
            this.deleteUserSession();
            window.location.href = '/';
        });
    }

    public get currentOrgId(): string | null {
        this.fetchUserSession();
        return this._userSession?.currentOrganization?.id || null;
    }

    public get username(): string | null {
        this.fetchUserSession();
        return this._userSession?.profile?.name || null;
    }

    /// Load user context from Firestore
    private loadUserContext(fireUser: FireUser): Observable<AuthResult> {
        return new Observable<AuthResult>((observer) => {
            // Get user profile
            const userRef = this.firestoreCollections.users.docRef(fireUser.uid);

            docData(userRef)
                .pipe(
                    switchMap((userProfile) => {
                        if (!userProfile) {
                            const error = new Error('User profile not found');
                            if (this._debugAuth) console.warn(error.message);
                            observer.error(error);
                            return throwError(() => error);
                        }

                        // Get organization data
                        const orgId = userProfile.defaultOrgId;
                        const orgRef = this.firestoreCollections.organizations.docRef(orgId);
                        return docData(orgRef).pipe(
                            map((orgData) => {
                                if (!orgData) {
                                    const error = new Error('Organization not found');
                                    if (this._debugAuth) console.warn(error.message);
                                    observer.error(error);
                                    throw error;
                                }

                                // Create the session data
                                const sessionData: AuthResult = {
                                    profile: userProfile as User,
                                    currentOrganization: orgData as Organization
                                };

                                // Update the context
                                this.storeUserSession(sessionData);

                                // Complete the observable
                                observer.next(sessionData);
                                observer.complete();

                                return sessionData;
                            })
                        );
                    }),
                    catchError((error) => {
                        if (this._debugAuth) console.error('Error loading user context:', error);
                        observer.error(error);
                        return throwError(() => new Error('Failed to load user context: ' + error.message));
                    })
                )
                .subscribe();
        });
    }

    // Try to restore session from localStorage on page refresh
    private fetchUserSession() {
        const savedSession = localStorage.getItem(AuthService.USER_SESSION_KEY);
        if (savedSession) {
            this._userSession = JSON.parse(savedSession);
            if (this._debugAuth) Logger.log('Session restored:', this._userSession);
        }
    }

    private storeUserSession(sessionData: AuthResult) {
        localStorage.setItem(AuthService.USER_SESSION_KEY, JSON.stringify(sessionData));
    }

    private deleteUserSession() {
        localStorage.removeItem(AuthService.USER_SESSION_KEY);
        this._userSession = null;
    }
}
