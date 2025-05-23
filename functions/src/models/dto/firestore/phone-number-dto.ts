import { PhoneNumber } from "@models/domain/phone-number";
import { fireDb } from "firebase-config";
import { DocumentReference, FirestoreDataConverter, QueryDocumentSnapshot, Timestamp, WithFieldValue } from "firebase-admin/firestore";

export interface PhoneNumberDoc {
    number: string;
    orgId: string;
    orgRef: DocumentReference;
    label?: string;
    dateCreated: Timestamp;
    dateUpdated: Timestamp;
}

/**
 * Convert Domain → Firestore
 */
export function toPhoneNumberDoc(p: WithFieldValue<PhoneNumber>): PhoneNumberDoc {
    const orgRef = fireDb.collection('organizations').doc(p.orgId as string) as DocumentReference;

    return {
        number: p.number as string,
        label: p.label as string | undefined,
        orgId: p.orgId as string,
        orgRef,
        dateCreated: Timestamp.fromDate(p.dateCreated as Date),
        dateUpdated: Timestamp.fromDate(p.dateUpdated as Date),
    };
}

/**
 * Convert Firestore → Domain
 */
export function fromPhoneNumberDoc(doc: PhoneNumberDoc): PhoneNumber {
    return {
        number: doc.number,
        orgId: doc.orgId,
        label: doc.label,
        dateCreated: doc.dateCreated.toDate(),
        dateUpdated: doc.dateUpdated.toDate(),
    };
}

export const phoneNumberConverter: FirestoreDataConverter<PhoneNumber> = {
    toFirestore: (p: WithFieldValue<PhoneNumber>) => toPhoneNumberDoc(p),
    fromFirestore: (snap: QueryDocumentSnapshot) =>
        fromPhoneNumberDoc(snap.data() as PhoneNumberDoc),
};