import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

import { Injectable, inject } from '@angular/core';
import { getDocs } from '@angular/fire/firestore';

import { Organization } from '@/api/models/organization';
import { User } from '@/api/models/user';
import { FirestoreCollectionsService } from '@/api/services/firestore-collections';

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    private firestoreCollections = inject(FirestoreCollectionsService);

    /**
     * Get all users in the system
     */
    getUsers(): Observable<User[]> {
        const usersCollection = this.firestoreCollections.users.collection();
        return from(getDocs(usersCollection)).pipe(map((snapshot) => snapshot.docs.map((doc) => doc.data())));
    }

    /**
     * Get all organizations in the system
     */
    getOrganizations(): Observable<Organization[]> {
        const orgsCollection = this.firestoreCollections.organizations.collection();
        return from(getDocs(orgsCollection)).pipe(map((snapshot) => snapshot.docs.map((doc) => doc.data())));
    }
}
