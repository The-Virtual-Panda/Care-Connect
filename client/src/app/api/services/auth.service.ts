import { inject, Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, User as FireUser, createUserWithEmailAndPassword, onAuthStateChanged, AuthError } from '@angular/fire/auth';
import { BehaviorSubject, catchError, firstValueFrom, from, map, Observable, switchMap, throwError } from 'rxjs';
import { UserService } from './user.service';
import { FirestoreCollectionsService } from './firestore-collections';
import { Organization } from '@/api/models/organization';
import { User } from '@/api/models/user';
import { docData } from '@angular/fire/firestore';

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
        onAuthStateChanged(this.auth, (user) => {
            if (this._debugAuth) console.log('Auth state changed:', user);
            this.userSubject.next(user);

            // If user logged in, fetch extended profile
            if (user && this._userSession == null) {
                // Load user context from Firestore
                this.loadUserContext(user);
            } else if (!user) {
                // User logged out or session expired, clear session
                this.deleteUserSession();
            }
        });

        // Try to restore session from localStorage
        this.fetchUserSession();
    }

    isLoggedIn(): boolean {
        this.fetchUserSession();
        return this._userSession != null;
    }

    login(email: string, password: string): Observable<FireUser> {
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

                if (this._debugAuth) console.log('Registration error:', error);

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
    private async loadUserContext(fireUser: FireUser) {
        try {
            // Get user profile
            const userRef = this.firestoreCollections.users.docRef(fireUser.uid);
            const userProfile = await firstValueFrom(docData(userRef));

            if (!userProfile) {
                if (this._debugAuth) console.warn('User profile not found');
                return;
            }

            // Get organization data
            const orgId = userProfile.defaultOrgId;
            const orgRef = this.firestoreCollections.organizations.docRef(orgId);
            const orgData = await firstValueFrom(docData(orgRef));

            if (!orgData) {
                if (this._debugAuth) console.warn('Organization not found');
                return;
            }

            // Update the context
            this.storeUserSession({
                profile: userProfile,
                currentOrganization: orgData,
            });

        } catch (error) {
            if (this._debugAuth) console.error('Error loading user context:', error);
        }
    }

    // Try to restore session from localStorage on page refresh
    private fetchUserSession() {
        const savedSession = localStorage.getItem(AuthService.USER_SESSION_KEY);
        if (savedSession) {
            this._userSession = JSON.parse(savedSession);
            if (this._debugAuth) console.log('Session restored:', this._userSession);
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
