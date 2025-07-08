import { Timestamp, DocumentData, QueryDocumentSnapshot, SnapshotOptions, DocumentReference } from '@angular/fire/firestore';
import { addCountryCode, removeCountryCode } from '../helpers/phone-helpers';
import { FirestoreCollectionsService } from '../services/firestore-collections';

export interface PhoneNumber {
    id: string;
    number: string;  // E.164 format string (e.g., "+12025551234")
    fallbackForwardingNumber?: string;
    useFallbackForwardingNumber?: boolean;
    orgId: string;
    label?: string;
    usageType: number;
    dateCreated: Date;
    dateUpdated: Date;
}

export interface PhoneNumberDoc {
    number: string;
    fallbackForwardingNumber?: string;
    useFallbackForwardingNumber?: boolean;
    orgId: string;
    orgRef: DocumentReference;
    label?: string;
    usageType: number;
    dateCreated: Timestamp;
    dateUpdated: Timestamp;
}

// Converter functions
export function toPhoneNumber(doc: PhoneNumberDoc, id: string): PhoneNumber {
    return {
        id,
        number: removeCountryCode(doc.number),
        fallbackForwardingNumber: doc.fallbackForwardingNumber ? removeCountryCode(doc.fallbackForwardingNumber) : undefined,
        useFallbackForwardingNumber: doc.useFallbackForwardingNumber,
        orgId: doc.orgId,
        label: doc.label,
        usageType: doc.usageType,
        dateCreated: doc.dateCreated.toDate(),
        dateUpdated: doc.dateUpdated.toDate(),
    };
}

export function fromPhoneNumber(phoneNumber: PhoneNumber, firestoreCollections: FirestoreCollectionsService): PhoneNumberDoc {
    const orgRef = firestoreCollections.organizations.docRef(phoneNumber.orgId);

    return {
        number: addCountryCode(phoneNumber.number),
        fallbackForwardingNumber: phoneNumber.fallbackForwardingNumber ? addCountryCode(phoneNumber.fallbackForwardingNumber) : undefined,
        useFallbackForwardingNumber: phoneNumber.useFallbackForwardingNumber,
        orgId: phoneNumber.orgId,
        orgRef: orgRef,
        label: phoneNumber.label,
        usageType: phoneNumber.usageType,
        dateCreated: Timestamp.fromDate(phoneNumber.dateCreated),
        dateUpdated: Timestamp.fromDate(phoneNumber.dateUpdated),
    };
}

// Optional: FirestoreDataConverter for AngularFire
export const phoneNumberConverter = (firestoreCollections: FirestoreCollectionsService) => ({
    toFirestore: (phoneNumber: PhoneNumber) => fromPhoneNumber(phoneNumber, firestoreCollections),
    fromFirestore: (snapshot: QueryDocumentSnapshot<DocumentData>, options: SnapshotOptions) => {
        const data = snapshot.data(options) as PhoneNumberDoc;
        return toPhoneNumber(data, snapshot.id);
    }
});
