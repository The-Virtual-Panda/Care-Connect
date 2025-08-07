import {
    DocumentReference,
    FirestoreDataConverter,
    QueryDocumentSnapshot,
    Timestamp,
    WithFieldValue,
} from 'firebase-admin/firestore';
import { PhoneNumber } from '../../domain/phone-number';
import { FirestoreCollections } from '../../../services/firestore-service';
import { fireDb } from '../../../configs';

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

/**
 * Convert Domain → Firestore
 */
export function toPhoneNumberDoc(
    p: WithFieldValue<PhoneNumber>
): PhoneNumberDoc {
    const orgRef = fireDb
        .collection(FirestoreCollections.organizations.root)
        .doc(p.orgId as string) as DocumentReference;

    return {
        number: p.number as string,
        fallbackForwardingNumber: p.fallbackForwardingNumber as
            | string
            | undefined,
        useFallbackForwardingNumber: p.useFallbackForwardingNumber as
            | boolean
            | undefined,
        label: p.label as string | undefined,
        orgId: p.orgId as string,
        orgRef,
        usageType: p.usageType as number,
        dateCreated: Timestamp.fromDate(p.dateCreated as Date),
        dateUpdated: Timestamp.fromDate(p.dateUpdated as Date),
    };
}

/**
 * Convert Firestore → Domain
 */
export function fromPhoneNumberDoc(
    doc: PhoneNumberDoc,
    id: string
): PhoneNumber {
    return {
        id,
        number: doc.number,
        fallbackForwardingNumber: doc.fallbackForwardingNumber,
        useFallbackForwardingNumber: doc.useFallbackForwardingNumber,
        orgId: doc.orgId,
        label: doc.label,
        usageType: doc.usageType,
        dateCreated: doc.dateCreated.toDate(),
        dateUpdated: doc.dateUpdated.toDate(),
    };
}

export const phoneNumberConverter: FirestoreDataConverter<PhoneNumber> = {
    toFirestore: (p: WithFieldValue<PhoneNumber>) => toPhoneNumberDoc(p),
    fromFirestore: (snap: QueryDocumentSnapshot) =>
        fromPhoneNumberDoc(snap.data() as PhoneNumberDoc, snap.id),
};
