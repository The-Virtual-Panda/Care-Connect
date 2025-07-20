import { Organization } from '@/api/models/organization';
import { User } from '@/api/models/user';
import { FirestoreCollectionsService } from '@/api/services/firestore-collections';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

import { Injectable, inject } from '@angular/core';
import { getDocs } from '@angular/fire/firestore';

import { OrgMembership } from '../models/org-membership';

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
}
