import { Timestamp, DocumentData, QueryDocumentSnapshot, SnapshotOptions } from '@angular/fire/firestore';

/** Domain model */
export interface TeamMember {
    id: string;
    name: string;
    phoneNumber: string;
    dateCreated: Date;
    dateUpdated: Date;
}

/** Firestore DTO */
export interface TeamMemberDoc {
    name: string;
    phoneNumber: string;
    dateCreated: Timestamp;
    dateUpdated: Timestamp;
}

// Converter functions
export function toTeamMember(id: string, doc: TeamMemberDoc): TeamMember {
    return {
        id,
        name: doc.name,
        phoneNumber: doc.phoneNumber,
        dateCreated: doc.dateCreated.toDate(),
        dateUpdated: doc.dateUpdated.toDate(),
    };
}

export function fromTeamMember(member: TeamMember): TeamMemberDoc {
    return {
        name: member.name,
        phoneNumber: member.phoneNumber,
        dateCreated: Timestamp.fromDate(member.dateCreated),
        dateUpdated: Timestamp.fromDate(member.dateUpdated),
    };
}

// FirestoreDataConverter for AngularFire
export const teamMemberConverter = {
    toFirestore: (member: TeamMember) => fromTeamMember(member),
    fromFirestore: (snapshot: QueryDocumentSnapshot<DocumentData>, options: SnapshotOptions) => {
        const data = snapshot.data(options) as TeamMemberDoc;
        return toTeamMember(snapshot.id, data);
    }
};
