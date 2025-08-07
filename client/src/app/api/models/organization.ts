import { DocumentData, QueryDocumentSnapshot, SnapshotOptions, Timestamp } from '@angular/fire/firestore';

export interface Organization {
    id: string | null;
    name: string;
    dateCreated: Date;
    dateUpdated: Date;
    stripeCustomerId?: string | null;
    twilioAccountSid?: string | null;
    twilioAuthToken?: string | null;
}

export interface OrganizationDoc {
    name: string;
    dateCreated: Timestamp;
    dateUpdated: Timestamp;
    stripeCustomerId?: string;
    twilioAccountSid?: string;
    twilioAuthToken?: string;
}

// Converter functions
export function toOrganization(doc: OrganizationDoc, id: string): Organization {
    return {
        id,
        name: doc.name,
        dateCreated: doc.dateCreated.toDate(),
        dateUpdated: doc.dateUpdated.toDate(),
        stripeCustomerId: doc.stripeCustomerId || null,
        twilioAccountSid: doc.twilioAccountSid || null,
        twilioAuthToken: doc.twilioAuthToken || null
    };
}

export function fromOrganization(org: Organization): OrganizationDoc {
    return {
        name: org.name,
        dateCreated: Timestamp.fromDate(org.dateCreated),
        dateUpdated: Timestamp.fromDate(org.dateUpdated),
        stripeCustomerId: org.stripeCustomerId ?? undefined,
        twilioAccountSid: org.twilioAccountSid ?? undefined,
        twilioAuthToken: org.twilioAuthToken ?? undefined
    };
}

// Optional: FirestoreDataConverter for AngularFire
export const orgConverter = {
    toFirestore: (org: Organization) => fromOrganization(org),
    fromFirestore: (snapshot: QueryDocumentSnapshot<DocumentData>, options: SnapshotOptions) => {
        const data = snapshot.data(options) as OrganizationDoc;
        return toOrganization(data, snapshot.id);
    }
};
