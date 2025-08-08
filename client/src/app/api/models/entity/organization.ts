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

interface OrganizationFireDoc {
    name: string;
    dateCreated: Timestamp;
    dateUpdated: Timestamp;
    stripeCustomerId: string | null;
    twilioAccountSid: string | null;
    twilioAuthToken: string | null;
}

function fromFireDoc(doc: OrganizationFireDoc, id: string): Organization {
    return {
        id,
        name: doc.name,
        dateCreated: doc.dateCreated.toDate(),
        dateUpdated: doc.dateUpdated.toDate(),
        stripeCustomerId: doc.stripeCustomerId ?? null,
        twilioAccountSid: doc.twilioAccountSid ?? null,
        twilioAuthToken: doc.twilioAuthToken ?? null
    };
}

function toFireDoc(org: Organization): OrganizationFireDoc {
    return {
        name: org.name,
        dateCreated: Timestamp.fromDate(org.dateCreated),
        dateUpdated: Timestamp.fromDate(org.dateUpdated),
        stripeCustomerId: org.stripeCustomerId ?? null,
        twilioAccountSid: org.twilioAccountSid ?? null,
        twilioAuthToken: org.twilioAuthToken ?? null
    };
}

// Optional: FirestoreDataConverter for AngularFire
export const orgConverter = {
    toFirestore: (org: Organization) => toFireDoc(org),
    fromFirestore: (snapshot: QueryDocumentSnapshot<DocumentData>, options: SnapshotOptions) => {
        const data = snapshot.data(options) as OrganizationFireDoc;
        return fromFireDoc(data, snapshot.id);
    }
};
