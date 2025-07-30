import { Organization } from '@/api/models/organization';
import { User } from '@/api/models/user';
import { Logger } from '@/utils/logger';
import { BehaviorSubject, Observable, catchError, first, forkJoin, from, map, of, switchMap, throwError } from 'rxjs';

import { Injectable, Signal, WritableSignal, computed, inject, signal } from '@angular/core';
import {
    Auth,
    AuthError,
    EmailAuthProvider,
    User as FireUser,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    reauthenticateWithCredential,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    updatePassword
} from '@angular/fire/auth';
import { docData } from '@angular/fire/firestore';

import { FirestoreCollectionsService } from './firestore-collections';
import { UserService } from './user.service';

// Extended user context with more than just Firebase auth user
export interface AuthResult {
    profile: User | null;
    focusedOrg: Organization | null;
    isSystemAdmin?: boolean | null;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    public static readonly USER_SESSION_KEY = 'user-session';

    private fireAuth: Auth = inject(Auth);
    private userService = inject(UserService);
    private firestoreCollections = inject(FirestoreCollectionsService);

    private _debugAuth = false;

    fireUser: WritableSignal<FireUser | null> = signal(null);
    userSession: WritableSignal<AuthResult | null> = signal(null);

    isLoggedIn: Signal<boolean> = computed(() => this.userSession() != null);
    isSystemAdmin: Signal<boolean> = computed(() => this.userSession()?.isSystemAdmin === true);
    currentOrgId: Signal<string | null> = computed(() => this.userSession()?.focusedOrg?.id || null);
    username: Signal<string | null> = computed(() => this.userSession()?.profile?.name || null);
    userId: Signal<string | null> = computed(() => this.userSession()?.profile?.uid || null);

    constructor() {
        // Try to restore session from localStorage
        this.fetchUserSession();

        onAuthStateChanged(this.fireAuth, (user) => {
            if (this._debugAuth) Logger.log('Auth state changed:', user);
            this.fireUser.set(user);

            // If user logged in, fetch extended profile
            if (user && this.userSession() == null) {
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
                this.clearUserSession();
            }
        });
    }

    login(email: string, password: string): Observable<AuthResult> {
        return from(signInWithEmailAndPassword(this.fireAuth, email, password)).pipe(
            switchMap((userCredential) => {
                this.fireUser.set(userCredential.user);
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

                Logger.error('Login error:', error);
                return throwError(() => new Error(errorMessage));
            })
        );
    }

    registerSelf(email: string, password: string, name: string, orgName: string): Observable<AuthResult> {
        return from(createUserWithEmailAndPassword(this.fireAuth, email, password)).pipe(
            switchMap((userCredential) => {
                this.fireUser.set(userCredential.user);

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

                Logger.error('Registration error:', error);
                return throwError(() => new Error(errorMessage));
            })
        );
    }

    async logout() {
        await this.fireAuth.signOut().then(() => {
            localStorage.clear();
            this.clearUserSession();
            window.location.href = '/';
        });
    }

    /**
     * Changes password for the currently signed‑in user.
     * @param currentPassword – used to reauthenticate
     * @param newPassword – the new password
     */
    changePassword(currentPassword: string, newPassword: string): Observable<void> {
        if (!this.fireAuth.currentUser || !this.fireAuth.currentUser.email) {
            return throwError(() => new Error('No user is currently signed in.'));
        }

        const credential = EmailAuthProvider.credential(this.fireAuth.currentUser.email, currentPassword);
        return from(reauthenticateWithCredential(this.fireAuth.currentUser, credential)).pipe(
            switchMap(() => from(updatePassword(this.fireAuth.currentUser!, newPassword))),
            map(() => undefined),
            catchError((err: any) => {
                let msg = 'Failed to change password. Please try again.';
                if (err.code) {
                    switch (err.code) {
                        case 'auth/wrong-password':
                            msg = 'Current password is incorrect.';
                            break;
                        case 'auth/weak-password':
                            msg = 'New password is too weak.';
                            break;
                        case 'auth/requires-recent-login':
                            msg = 'Please sign in again and retry.';
                            break;
                        case 'auth/network-request-failed':
                            msg = 'Network error. Check your connection.';
                            break;
                        // …add more cases as you see fit…
                    }
                } else if (err.message) {
                    msg = err.message;
                }
                return throwError(() => new Error(msg));
            })
        );
    }

    /// Load user context from Firestore
    private loadUserContext(fireUser: FireUser): Observable<AuthResult> {
        const userRef = this.firestoreCollections.users.docRef(fireUser.uid);

        const userPlusOrg$ = docData(userRef).pipe(
            first(),
            switchMap((userProfile: User | undefined) => {
                if (!userProfile) {
                    return throwError(() => new Error('User profile not found'));
                }
                return docData(this.firestoreCollections.organizations.docRef(userProfile.defaultOrgId)).pipe(
                    first(),
                    map((orgData: Organization | undefined) => {
                        if (!orgData) {
                            throw new Error('Organization not found');
                        }
                        return { userProfile, orgData };
                    })
                );
            })
        );

        const claims$ = from(fireUser.getIdTokenResult(true)).pipe(
            map((idTokenResult) => idTokenResult.claims ?? {}),
            catchError(() => of({}))
        );

        return forkJoin([userPlusOrg$, claims$]).pipe(
            map(([{ userProfile, orgData }, claims]) => {
                const isSystemAdmin = Boolean((claims as any)?.systemAdmin);
                const sessionData: AuthResult = {
                    profile: userProfile,
                    focusedOrg: orgData,
                    isSystemAdmin
                };

                if (this._debugAuth) Logger.log('System admin status:', isSystemAdmin);

                this.storeUserSession(sessionData);
                return sessionData;
            }),
            catchError((err) => {
                Logger.error('Error loading user context:', err);
                return throwError(() => new Error('Failed to load user context: ' + err.message));
            })
        );
    }

    // Try to restore session from localStorage on page refresh
    private fetchUserSession() {
        const savedSession = localStorage.getItem(AuthService.USER_SESSION_KEY);
        if (savedSession) {
            const parsedSession = JSON.parse(savedSession);
            this.userSession.set(parsedSession);
            if (this._debugAuth) Logger.log('Session restored:', this.userSession);
        }
    }

    private storeUserSession(sessionData: AuthResult) {
        localStorage.setItem(AuthService.USER_SESSION_KEY, JSON.stringify(sessionData));
        this.userSession.set(sessionData);
        if (this._debugAuth) Logger.log('Session stored:', sessionData);
    }

    private clearUserSession() {
        localStorage.removeItem(AuthService.USER_SESSION_KEY);
        this.userSession.set(null);
        if (this._debugAuth) Logger.log('Session cleared');
    }
}
