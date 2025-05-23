import {
    FirestoreDataConverter,
    QueryDocumentSnapshot,
    WithFieldValue,
    Timestamp
} from "firebase-admin/firestore";
import { TeamMember } from "../../domain/team-member";

/** Firestore‐shaped version of your TeamMember */
export interface TeamMemberDoc {
    name: string;
    phoneNumber: string;    // E.164 string
    dateCreated: Timestamp;
    dateUpdated: Timestamp;
}

/**
 * Convert Domain → Firestore
 */
export function toTeamMemberDoc(
    p: WithFieldValue<TeamMember>
): TeamMemberDoc {
    return {
        name: p.name as string,
        phoneNumber: p.phoneNumber as string,
        dateCreated: Timestamp.fromDate(p.dateCreated as Date),
        dateUpdated: Timestamp.fromDate(p.dateUpdated as Date),
    };
}

/**
 * Convert Firestore → Domain
 */
export function fromTeamMemberDoc(doc: TeamMemberDoc, id: string): TeamMember {
    return {
        id,
        name: doc.name,
        phoneNumber: doc.phoneNumber,
        dateCreated: doc.dateCreated.toDate(),
        dateUpdated: doc.dateUpdated.toDate(),
    };
}

/** FirestoreDataConverter bound to your pure `TeamMember` type */
export const teamMemberConverter: FirestoreDataConverter<TeamMember> = {
    toFirestore: (p: WithFieldValue<TeamMember>) => toTeamMemberDoc(p),
    fromFirestore: (snap: QueryDocumentSnapshot) =>
        fromTeamMemberDoc(snap.data() as TeamMemberDoc, snap.id),
};