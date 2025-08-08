import { Organization } from '@/api/models/entity/organization';
import { User } from '@/api/models/entity/user';
import { FirestoreCollectionsService } from '@/api/services/firestore-collections';
import { Observable, forkJoin, from } from 'rxjs';
import { map } from 'rxjs/operators';

import { Injectable, inject } from '@angular/core';
import { getDocs, setDoc } from '@angular/fire/firestore';

import { OrgMembership } from '../models/entity/org-membership';
import { InviteStatus } from '../models/enums/invite-status';
import { OrgRole } from '../models/enums/org-role';

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    private firestoreCollections = inject(FirestoreCollectionsService);

    /**
     * Get all users in the system
     */
    getAllUsers(): Observable<User[]> {
        const usersCollection = this.firestoreCollections.users.collection();
        return from(getDocs(usersCollection)).pipe(map((snapshot) => snapshot.docs.map((doc) => doc.data())));
    }

    /**
     * Get all organizations a user is a member of
     * @param userId The ID of the user
     */
    getUserOrgMemberships(userId: string): Observable<OrgMembership[]> {
        const userOrgsCollection = this.firestoreCollections.users.orgMemberships.collection(userId);
        return from(getDocs(userOrgsCollection)).pipe(map((snapshot) => snapshot.docs.map((doc) => doc.data())));
    }

    /**
     * Get all organizations in the system
     */
    getAllOrgs(): Observable<Organization[]> {
        const orgsCollection = this.firestoreCollections.organizations.collection();
        return from(getDocs(orgsCollection)).pipe(map((snapshot) => snapshot.docs.map((doc) => doc.data())));
    }

    getOrgMembers(orgId: string): Observable<OrgMembership[]> {
        const orgMembersCollection = this.firestoreCollections.organizations.users.collection(orgId);
        return from(getDocs(orgMembersCollection)).pipe(map((snapshot) => snapshot.docs.map((doc) => doc.data())));
    }

    /**
     * Add a user to an organization with default status and role
     * @param userId The ID of the user
     * @param orgId The ID of the organization
     * @param orgRole The role to assign to the user in the organization
     */
    addUserToOrg(userId: string, orgId: string, orgRole: OrgRole): Observable<void> {
        const orgMembership: OrgMembership = {
            id: '',
            userId,
            orgId,
            inviteStatus: InviteStatus.Active,
            role: orgRole,
            dateJoined: new Date()
        };

        const membershipRef = this.firestoreCollections.users.orgMemberships.docRef(userId, orgId);
        const orgUserRef = this.firestoreCollections.organizations.users.docRef(orgId, userId);

        return forkJoin([
            // Create user's membership - pass the model directly
            from(setDoc(membershipRef, orgMembership)),

            // Add user to organization's users collection
            from(setDoc(orgUserRef, orgMembership))
        ]).pipe(map(() => void 0));
    }
}
