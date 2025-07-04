// src/app/services/user.service.ts
import { inject, Injectable } from '@angular/core';
import { Firestore, doc, setDoc, serverTimestamp } from '@angular/fire/firestore';
import { from, forkJoin, Observable, switchMap, map } from 'rxjs';
import { fromUser, User, userConverter } from '@/models/user';
import { OrgRole } from '@/models/enums/org-role';
import { fromOrgMembership, OrgMembership, orgMembershipConverter } from '@/models/org-membership';
import { InviteStatus } from '@/models/enums/invite-status';
import { Organization, orgConverter } from '@/models/organization';
import { FirestoreCollectionsService } from './firestore-collections';

@Injectable({ providedIn: 'root' })
export class UserService {

    private firestoreCollections = inject(FirestoreCollectionsService);

    createUserAndOrg(
        uid: string,
        email: string,
        name: string,
        orgName: string,
    ): Observable<{ userId: string, orgId: string }> {
        // Generate a new organization ID

        const orgCol = this.firestoreCollections.organizations.collection();
        const orgRef = doc(orgCol);
        const orgId = orgRef.id;

        // Use withConverter to apply the converters
        const userRef = this.firestoreCollections.users.docRef(uid);
        const membershipRef = this.firestoreCollections.users.orgMemberships.docRef(
            uid,
            orgId
        );
        const orgUserRef = this.firestoreCollections.organizations.users.docRef(
            orgId,
            uid
        );

        const now = new Date();

        // Create user object using the model interface
        const userData: User = {
            uid: uid,
            email,
            name: name,
            defaultOrgId: orgId,
            lastLogin: now,
            dateCreated: now,
            dateUpdated: now,
        };

        const orgData: Organization = {
            id: orgId,
            name: orgName,
            dateCreated: now,
            dateUpdated: now,
            twilioAccountSid: null,
            twilioAuthToken: null,
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
            from(setDoc(orgUserRef, membershipData)),
        ]).pipe(
            map(() => ({ userId: uid, orgId: orgId }))
        );
    }

}
