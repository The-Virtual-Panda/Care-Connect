import { Timestamp, DocumentData, QueryDocumentSnapshot, SnapshotOptions } from '@angular/fire/firestore';

export interface Organization {
    id: string;
    name: string;
    dateCreated: Date;
    dateUpdated: Date;
    twilioAccountSid?: string;
    twilioAuthToken?: string;
}

export interface OrganizationDoc {
    name: string;
    dateCreated: Timestamp;
    dateUpdated: Timestamp;
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
        twilioAccountSid: doc.twilioAccountSid,
        twilioAuthToken: doc.twilioAuthToken,
    };
}

export function fromOrganization(org: Organization): OrganizationDoc {
    return {
        name: org.name,
        dateCreated: Timestamp.fromDate(org.dateCreated),
        dateUpdated: Timestamp.fromDate(org.dateUpdated),
        twilioAccountSid: org.twilioAccountSid,
        twilioAuthToken: org.twilioAuthToken,
    };
}

// Optional: FirestoreDataConverter for AngularFire
export const organizationConverter = {
    toFirestore: (org: Organization) => fromOrganization(org),
    fromFirestore: (snapshot: QueryDocumentSnapshot<DocumentData>, options: SnapshotOptions) => {
        const data = snapshot.data(options) as OrganizationDoc;
        return toOrganization(data, snapshot.id);
    }
};
