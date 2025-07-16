// src/app/services/user.service.ts
import { Observable, forkJoin, from, map, of, switchMap } from 'rxjs';

import { Injectable, inject } from '@angular/core';
import { collectionData, doc, getDoc, getDocs, query, setDoc, where } from '@angular/fire/firestore';

import { InviteStatus } from '@/api/models/enums/invite-status';
import { OrgRole } from '@/api/models/enums/org-role';
import { OrgMembership } from '@/api/models/org-membership';
import { Organization } from '@/api/models/organization';
import { User } from '@/api/models/user';

import { FirestoreCollectionsService } from './firestore-collections';

@Injectable({ providedIn: 'root' })
export class UserService {
    private firestoreCollections = inject(FirestoreCollectionsService);

    createUserAndOrg(uid: string, email: string, name: string, orgName: string): Observable<{ userId: string; orgId: string }> {
        // Generate a new organization ID

        const orgCol = this.firestoreCollections.organizations.collection();
        const orgRef = doc(orgCol);
        const orgId = orgRef.id;

        // Use withConverter to apply the converters
        const userRef = this.firestoreCollections.users.docRef(uid);
        const membershipRef = this.firestoreCollections.users.orgMemberships.docRef(uid, orgId);
        const orgUserRef = this.firestoreCollections.organizations.users.docRef(orgId, uid);

        const now = new Date();

        // Create user object using the model interface
        const userData: User = {
            uid: uid,
            email,
            name: name,
            defaultOrgId: orgId,
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

        return forkJoin([
            // Create user document - pass the model directly
            from(setDoc(userRef, userData)),

            // Create organization document
            from(setDoc(orgRef, orgData)),

            // Create user's membership - pass the model directly
            from(setDoc(membershipRef, membershipData)),

            // Add user to organization's users collection
            from(setDoc(orgUserRef, membershipData))
        ]).pipe(map(() => ({ userId: uid, orgId: orgId })));
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
}
