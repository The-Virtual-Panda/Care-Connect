// src/app/services/user.service.ts
import { InviteStatus } from '@/api/models/enums/invite-status';
import { OrgRole } from '@/api/models/enums/org-role';
import { OrgMembership } from '@/api/models/org-membership';
import { Organization } from '@/api/models/organization';
import { User } from '@/api/models/user';
import { Observable, forkJoin, from, map, of, switchMap } from 'rxjs';

import { Injectable, Pipe, inject } from '@angular/core';
import { collectionData, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from '@angular/fire/firestore';
import { Storage, getDownloadURL, ref, uploadBytesResumable } from '@angular/fire/storage';

import { FirestoreCollectionsService } from './firestore-collections';

@Injectable({ providedIn: 'root' })
export class UserService {
    private firestoreCollections = inject(FirestoreCollectionsService);
    private storage = inject(Storage);

    createUserAndOrg(uid: string, email: string, name: string, orgName: string): Observable<{ userId: string; orgId: string }> {
        // Generate a new organization ID

        const orgCol = this.firestoreCollections.organizations.collection();
        const orgRef = doc(orgCol);
        const orgId = orgRef.id;

        // Use withConverter to apply the converters
        const userRef = this.firestoreCollections.users.docRef(uid);
        const orgUserRef = this.firestoreCollections.organizations.users.docRef(orgId, uid);
        const membershipRef = this.firestoreCollections.users.orgMemberships.docRef(uid, orgId);

        const now = new Date();

        // Create user object using the model interface
        const userData: User = {
            uid: uid,
            email,
            name: name,
            defaultOrgId: orgId,
            lastChangeBlogRead: null,
            notifyNewChangeBlogs: true,
            lastLogin: now,
            dateCreated: now,
            dateUpdated: now
        };

        const orgData: Organization = {
            id: orgId,
            name: orgName,
            dateCreated: now,
            dateUpdated: now,
            twilioAccountSid: null,
            twilioAuthToken: null
        };

        // Create membership object using the model interface
        const membershipData: OrgMembership = {
            id: orgId,
            userId: uid,
            orgId: orgId,
            role: OrgRole.Admin,
            inviteStatus: InviteStatus.Active,
            dateJoined: now
        };

        return forkJoin([from(setDoc(userRef, userData)), from(setDoc(orgRef, orgData))]).pipe(
            // Add user to the organization's users collection
            switchMap(() => from(setDoc(orgUserRef, membershipData))),

            // Create the user's membership document
            switchMap(() => from(setDoc(membershipRef, membershipData))),
            map(() => ({ userId: uid, orgId: orgId }))
        );
    }

    /**
     * Gets all organizations that a user is a member of
     *
     * @param userId The user ID to get organizations for
     * @returns Observable of organizations with membership details included
     */
    getUserOrganizations(userId: string | null): Observable<Array<Organization & { membership: OrgMembership }>> {
        if (!userId) return of([]);

        const membershipsCollection = this.firestoreCollections.users.orgMemberships.collection(userId);

        // Get all memberships for this user
        return collectionData(membershipsCollection).pipe(
            switchMap((memberships) => {
                if (!memberships || memberships.length === 0) {
                    return of([]); // No memberships found
                }

                // Create a map of org IDs to memberships for quick lookups
                const membershipMap = new Map<string, OrgMembership>();
                memberships.forEach((membership) => {
                    membershipMap.set(membership.orgId, membership);
                });

                // Get array of organization IDs
                const orgIds = Array.from(membershipMap.keys());

                // Users can't be in more than 10 organizations,
                // we can safely use a single query with the 'in' operator
                const orgsQuery = query(this.firestoreCollections.organizations.collection(), where('__name__', 'in', orgIds));

                return from(getDocs(orgsQuery)).pipe(
                    map((snapshot) => {
                        const orgs: Array<Organization & { membership: OrgMembership }> = [];
                        snapshot.forEach((doc) => {
                            const org = doc.data();

                            const membership = membershipMap.get(org.id);

                            if (membership) {
                                orgs.push({
                                    ...org,
                                    membership
                                });
                            }
                        });
                        return orgs;
                    })
                );
            })
        );
    }

    /**
     * Changes the user's default organization
     * @param userId The ID of the user
     * @param orgId The ID of the organization to set as default
     */
    changeDefaultOrg(userId: string | null, orgId: string): Observable<void> {
        if (!userId || !orgId) return of();

        const userRef = this.firestoreCollections.users.docRef(userId);
        return from(updateDoc(userRef, { defaultOrgId: orgId, dateUpdated: new Date() }));
    }

    /**
     * Gets the user profile by user ID.
     * @param userId The user ID to fetch.
     * @returns Observable of the User or null if not found.
     */
    getUserProfile(userId: string | null): Observable<User | null> {
        if (!userId) return of(null);

        const userRef = this.firestoreCollections.users.docRef(userId);
        return from(getDoc(userRef)).pipe(map((docSnap) => (docSnap.exists() ? (docSnap.data() as User) : null)));
    }

    getProfileImageUrl(userId: string | null): Observable<string | null> {
        if (!userId) return of(null);
        const userRef = this.firestoreCollections.users.docRef(userId);
        return from(getDoc(userRef)).pipe(
            map((docSnap) => {
                if (docSnap.exists()) {
                    const user = docSnap.data() as User;
                    return user.avatarUrl || null;
                }
                return null;
            })
        );
    }

    updateUserProfile(userId: string | null, newName: string): Observable<void> {
        if (!userId) return of();

        const userRef = this.firestoreCollections.users.docRef(userId);
        return from(updateDoc(userRef, { name: newName, dateModified: new Date() }));
    }

    uploadProfileImage(userId: string | null, file: File): Observable<string> {
        if (!userId) return of();

        const path = `users/${userId}/avatar/original_${Date.now()}.${this.getExt(file.name)}`;
        const storageRef = ref(this.storage, path);
        const task = uploadBytesResumable(storageRef, file, { contentType: file.type });

        // Wrap the upload task in an Observable
        const upload$ = new Observable<void>((observer) => {
            task.on(
                'state_changed',
                // progress cb (noop, but you could expose it)
                () => {},
                // error
                (err) => observer.error(err),
                // complete
                () => {
                    observer.next();
                    observer.complete();
                }
            );
        });

        return upload$.pipe(
            switchMap(() => from(getDownloadURL(storageRef))),
            switchMap((url) => {
                const userRef = this.firestoreCollections.users.docRef(userId);
                return from(updateDoc(userRef, { avatarUrl: url, dateAvatarUpdated: new Date() })).pipe(map(() => url));
            })
        );
    }

    private getExt(name: string): string {
        const i = name.lastIndexOf('.');
        return i >= 0 ? name.substring(i + 1) : 'jpg';
    }

    public markLatestChangeBlogRead(userId: string | null, slug: string): Observable<void> {
        if (!userId || !slug) return of();

        const userRef = this.firestoreCollections.users.docRef(userId);
        return from(updateDoc(userRef, { lastChangeBlogRead: slug, dateUpdated: new Date() }));
    }

    public updateChangeBlogNotificationPreference(userId: string | null, notify: boolean): Observable<void> {
        if (!userId) return of();

        const userRef = this.firestoreCollections.users.docRef(userId);
        return from(updateDoc(userRef, { notifyNewChangeBlogs: notify, dateUpdated: new Date() }));
    }
}
