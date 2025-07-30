import { TeamMember } from '@/api/models/team-member';
import { Observable, from, map, of, switchMap } from 'rxjs';

import { Injectable, inject } from '@angular/core';
import { collectionData, deleteDoc, doc, setDoc } from '@angular/fire/firestore';

import { AuthService } from './auth.service';
import { FirestoreCollectionsService } from './firestore-collections';

@Injectable({
    providedIn: 'root'
})
export class TeamService {
    private _authService = inject(AuthService);
    private firestoreCollections = inject(FirestoreCollectionsService);

    /**
     * Get all team members for the current user's organization
     */
    getTeamMembers(): Observable<TeamMember[]> {
        // Use of() to create an observable from the orgId, then switchMap to handle both cases
        return of(this._authService.currentOrgId()).pipe(
            switchMap((orgId) => {
                // If no organization selected, return empty array
                if (!orgId) return of([]);

                // Otherwise, query the collection
                const teamMembersCollection = this.firestoreCollections.organizations.teamMembers.collection(orgId);

                return collectionData(teamMembersCollection) as Observable<TeamMember[]>;
            })
        );
    }

    /**
     * Save a recipient (team member)
     * Creates a new one if it doesn't have an ID, updates if it does
     */
    saveRecipient(recipient: Partial<TeamMember>): Observable<string> {
        return of(this._authService.currentOrgId()).pipe(
            switchMap((orgId) => {
                if (!orgId) throw new Error('No organization selected');

                const isNewRecipient = !recipient.id;
                const recipientId = recipient.id || doc(this.firestoreCollections.organizations.teamMembers.collection(orgId)).id;

                const now = new Date();
                const recipientToSave: TeamMember = {
                    id: recipientId,
                    name: recipient.name || '',
                    phoneNumber: recipient.phoneNumber || '',
                    dateUpdated: now,
                    dateCreated: isNewRecipient ? now : recipient.dateCreated || now
                };

                const recipientDocRef = this.firestoreCollections.organizations.teamMembers.docRef(orgId, recipientId);

                // When using withConverter, we need to pass the data in the format the converter expects
                return from(setDoc(recipientDocRef, recipientToSave as any)).pipe(map(() => recipientId));
            })
        );
    }

    /**
     * Delete recipients (team members) by their IDs
     */
    deleteRecipients(recipientIds: string[]): Observable<void> {
        return of(this._authService.currentOrgId()).pipe(
            switchMap((orgId) => {
                if (!orgId) throw new Error('No organization selected');
                if (!recipientIds || !recipientIds.length) return of(undefined);

                // Create an array of deletion promises
                const deletionPromises = recipientIds.map((id) => {
                    const docRef = this.firestoreCollections.organizations.teamMembers.docRef(orgId, id);
                    return deleteDoc(docRef);
                });

                // Return an observable that completes when all deletions are done
                return from(Promise.all(deletionPromises)).pipe(map(() => undefined));
            })
        );
    }
}
