import {
    FirestoreDataConverter,
    QueryDocumentSnapshot,
    WithFieldValue,
    Timestamp,
} from "firebase-admin/firestore";
import type { Organization } from "@models/domain/organization";

/** Firestore‐shaped version of your Organization */
export interface OrganizationDoc {
    name: string;
    dateCreated: Timestamp;
    dateUpdated: Timestamp;
}

/**
 * Convert Domain → Firestore
 */
export function toOrganizationDoc(
    p: WithFieldValue<Organization>
): OrganizationDoc {
    return {
        name: p.name as string,
        dateCreated: Timestamp.fromDate(p.dateCreated as Date),
        dateUpdated: Timestamp.fromDate(p.dateUpdated as Date),
    };
}

/**
 * Convert Firestore → Domain
 */
export function fromOrganizationDoc(doc: OrganizationDoc): Organization {
    return {
        name: doc.name,
        dateCreated: doc.dateCreated.toDate(),
        dateUpdated: doc.dateUpdated.toDate(),
    };
}

/** FirestoreDataConverter bound to your pure `Organization` type */
export const organizationConverter: FirestoreDataConverter<Organization> = {
    toFirestore: (p: WithFieldValue<Organization>) => toOrganizationDoc(p),
    fromFirestore: (snap: QueryDocumentSnapshot) =>
        fromOrganizationDoc(snap.data() as OrganizationDoc),
};
