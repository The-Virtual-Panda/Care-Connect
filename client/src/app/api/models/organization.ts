import { DocumentData, QueryDocumentSnapshot, SnapshotOptions, Timestamp } from '@angular/fire/firestore';

export interface Organization {
    id: string;
    name: string;
    dateCreated: Date;
    dateUpdated: Date;
    twilioAccountSid: string | null;
    twilioAuthToken: string | null;
}

export interface OrganizationDoc {
    name: string;
    dateCreated: Timestamp;
    dateUpdated: Timestamp;
    twilioAccountSid: string | null;
    twilioAuthToken: string | null;
}

// Converter functions
export function toOrganization(doc: OrganizationDoc, id: string): Organization {
    return {
        id,
        name: doc.name,
        dateCreated: doc.dateCreated.toDate(),
        dateUpdated: doc.dateUpdated.toDate(),
        twilioAccountSid: doc.twilioAccountSid || null,
        twilioAuthToken: doc.twilioAuthToken || null
    };
}

export function fromOrganization(org: Organization): OrganizationDoc {
    return {
        name: org.name,
        dateCreated: Timestamp.fromDate(org.dateCreated),
        dateUpdated: Timestamp.fromDate(org.dateUpdated),
        twilioAccountSid: org.twilioAccountSid || null,
        twilioAuthToken: org.twilioAuthToken || null
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
