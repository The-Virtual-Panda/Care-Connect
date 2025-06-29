// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { Firestore, doc, setDoc, serverTimestamp } from '@angular/fire/firestore';
import { from, forkJoin, Observable, switchMap, map } from 'rxjs';
import { fromUser, User, userConverter } from '@/models/user';
import { OrgRole } from '@/models/enums/org-role';
import { fromOrgMembership, OrgMembership, orgMembershipConverter } from '@/models/org-membership';
import { FirestoreCollections } from './firestore-collections';
import { InviteStatus } from '@/models/enums/invite-status';
import { Organization, orgConverter } from '@/models/organization';

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private firestore: Firestore) { }

    createUserAndOrg(
        uid: string,
        email: string,
        name: string,
        orgName: string,
    ): Observable<{ userId: string, orgId: string }> {
        // Generate a new organization ID

        const orgCol = FirestoreCollections.organizations.collection(this.firestore);
        const orgRef = doc(orgCol);
        const orgId = orgRef.id;

        // Use withConverter to apply the converters
        const userRef = FirestoreCollections.users.docRef(this.firestore, uid);
        const membershipRef = FirestoreCollections.users.orgMemberships.docRef(
            this.firestore,
            uid,
            orgId
        );
        const orgUserRef = FirestoreCollections.organizations.users.docRef(
            this.firestore,
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
