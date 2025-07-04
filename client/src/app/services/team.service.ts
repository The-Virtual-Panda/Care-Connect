import { TeamMember } from '@/models/team-member';
import { inject, Injectable } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { FirestoreCollectionsService } from './firestore-collections';
import { collectionData, Firestore } from '@angular/fire/firestore';
import { AuthService } from './auth.service';

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
        return of(this._authService.currentOrgId).pipe(
            switchMap(orgId => {
                // If no organization selected, return empty array
                if (!orgId) return of([]);

                // Otherwise, query the collection
                const teamMembersCollection = this.firestoreCollections.organizations.teamMembers
                    .collection(orgId);

                return collectionData(teamMembersCollection) as Observable<TeamMember[]>;
            })
        );
    }
}
