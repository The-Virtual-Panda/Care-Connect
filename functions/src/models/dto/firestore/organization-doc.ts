import {
    FirestoreDataConverter,
    QueryDocumentSnapshot,
    WithFieldValue,
    Timestamp,
} from 'firebase-admin/firestore';
import { Organization } from '../../domain/organization';

/** Firestore‐shaped version of your Organization */
export interface OrganizationDoc {
    name: string;
    dateCreated: Timestamp;
    dateUpdated: Timestamp;
    stripeCustomerId?: string;
    twilioAccountSid?: string;
    twilioAuthToken?: string;
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
        stripeCustomerId: p.stripeCustomerId as string,
        twilioAccountSid: p.twilioAccountSid as string,
        twilioAuthToken: p.twilioAuthToken as string,
    };
}

/**
 * Convert Firestore → Domain
 */
export function fromOrganizationDoc(
    doc: OrganizationDoc,
    id: string
): Organization {
    return {
        id,
        name: doc.name,
        dateCreated: doc.dateCreated.toDate(),
        dateUpdated: doc.dateUpdated.toDate(),
        stripeCustomerId: doc.stripeCustomerId,
        twilioAccountSid: doc.twilioAccountSid,
        twilioAuthToken: doc.twilioAuthToken,
    };
}

/** FirestoreDataConverter bound to your pure `Organization` type */
export const organizationConverter: FirestoreDataConverter<Organization> = {
    toFirestore: (p: WithFieldValue<Organization>) => toOrganizationDoc(p),
    fromFirestore: (snap: QueryDocumentSnapshot) =>
        fromOrganizationDoc(snap.data() as OrganizationDoc, snap.id),
};
