import { TeamMember } from '@/api/models/entity/team-member';
import { Observable, from, map, of } from 'rxjs';

import { Injectable, inject } from '@angular/core';
import { collectionData, deleteDoc, doc, setDoc } from '@angular/fire/firestore';

import { FirestoreCollectionsService } from './firestore-collections';

@Injectable()
export class TeamService {
    private firestoreCollections = inject(FirestoreCollectionsService);

    /**
     * Get all team members for a given organization
     */
    getTeamMembers(orgId: string | null): Observable<TeamMember[]> {
        if (!orgId) return of([]);
        const teamMembersCollection = this.firestoreCollections.organizations.teamMembers.collection(orgId);
        return collectionData(teamMembersCollection) as Observable<TeamMember[]>;
    }

    /**
     * Save a recipient (team member)
     * Creates a new one if it doesn't have an ID, updates if it does
     */
    saveRecipient(orgId: string | null, recipient: Partial<TeamMember>): Observable<string> {
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
    }

    /**
     * Delete recipients (team members) by their IDs
     */
    deleteRecipients(orgId: string | null, recipientIds: string[]): Observable<void> {
        if (!orgId) throw new Error('No organization selected');
        if (!recipientIds || !recipientIds.length) return of(undefined);

        // Create an array of deletion promises
        const deletionPromises = recipientIds.map((id) => {
            const docRef = this.firestoreCollections.organizations.teamMembers.docRef(orgId, id);
            return deleteDoc(docRef);
        });

        // Return an observable that completes when all deletions are done
        return from(Promise.all(deletionPromises)).pipe(map(() => undefined));
    }
}
