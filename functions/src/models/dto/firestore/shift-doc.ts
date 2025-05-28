import {
    FirestoreDataConverter,
    QueryDocumentSnapshot,
    WithFieldValue,
    Timestamp,
} from "firebase-admin/firestore";
import { Shift } from "../../domain/shift";

/** Firestore‐shaped version of your Shift */
export interface ShiftDoc {
    assigneeId: string;
    start: Timestamp;
    end: Timestamp;
    enabled: boolean;
    timeZone: string;
}

/**
 * Convert Domain → Firestore
 */
export function toShiftDoc(
    p: WithFieldValue<Shift>
): ShiftDoc {
    return {
        assigneeId: p.assigneeId as string,
        start: Timestamp.fromDate(p.start as Date),
        end: Timestamp.fromDate(p.end as Date),
        enabled: p.enabled as boolean,
        timeZone: p.timeZone as string,
    };
}

/**
 * Convert Firestore → Domain
 */
export function fromShiftDoc(doc: ShiftDoc, id: string): Shift {
    return {
        id,
        assigneeId: doc.assigneeId,
        start: doc.start.toDate(),
        end: doc.end.toDate(),
        enabled: doc.enabled,
        timeZone: doc.timeZone,
    };
}

/** FirestoreDataConverter bound to your pure `Shift` type */
export const shiftConverter: FirestoreDataConverter<Shift> = {
    toFirestore: (p: WithFieldValue<Shift>) => toShiftDoc(p),
    fromFirestore: (snap: QueryDocumentSnapshot) =>
        fromShiftDoc(snap.data() as ShiftDoc, snap.id),
};