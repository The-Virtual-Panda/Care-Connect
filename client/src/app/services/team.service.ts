import { teamMemberConverter, TeamMember } from '@/models/team-member';
import { Injectable } from '@angular/core';
import { Firestore, collection, doc, addDoc, getDocs, updateDoc, deleteDoc, DocumentReference } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TeamService {
    constructor(private firestore: Firestore) { }

    private teamMembersCollection(orgId: string) {
        return collection(this.firestore, `organizations/${orgId}/teamMembers`).withConverter(teamMemberConverter);
    }

    getTeamMembers(orgId: string): Observable<TeamMember[]> {
        const colRef = this.teamMembersCollection(orgId);
        return from(
            getDocs(colRef).then(snapshot =>
                snapshot.docs.map(doc => doc.data())
            )
        );
    }

    addTeamMember(orgId: string, member: TeamMember): Observable<DocumentReference<TeamMember>> {
        const colRef = this.teamMembersCollection(orgId);
        return from(addDoc(colRef, member));
    }

    updateTeamMember(orgId: string, memberId: string, member: Partial<TeamMember>): Observable<void> {
        const docRef = doc(this.firestore, `organizations/${orgId}/teamMembers/${memberId}`).withConverter(teamMemberConverter);
        return from(updateDoc(docRef, member));
    }

    deleteTeamMember(orgId: string, memberId: string): Observable<void> {
        const docRef = doc(this.firestore, `organizations/${orgId}/teamMembers/${memberId}`).withConverter(teamMemberConverter);
        return from(deleteDoc(docRef));
    }
}
