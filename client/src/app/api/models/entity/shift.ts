import { DocumentData, QueryDocumentSnapshot, SnapshotOptions, Timestamp } from '@angular/fire/firestore';

/** Domain model */
export interface Shift {
    /** UUID or Firestore doc ID */
    id: string;

    /** The Team Member Id who's on call during this block */
    assigneeId: string;

    /** Inclusive start date/time of the shift (local‐tz) */
    start: Date;

    /** Exclusive end date/time of the shift (local‐tz) */
    end: Date;

    /** Enable/disable this shift without deleting it */
    enabled: boolean;

    /** IANA time zone of this shift */
    timeZone: string;
}

/** Firestore DTO */
export interface ShiftDoc {
    assigneeId: string;
    start: Timestamp;
    end: Timestamp;
    enabled: boolean;
    timeZone: string;
}

// Converter functions
export function toShift(id: string, doc: ShiftDoc): Shift {
    return {
        id,
        assigneeId: doc.assigneeId,
        start: doc.start.toDate(),
        end: doc.end.toDate(),
        enabled: doc.enabled,
        timeZone: doc.timeZone
    };
}

export function fromShift(shift: Shift): ShiftDoc {
    return {
        assigneeId: shift.assigneeId,
        start: Timestamp.fromDate(shift.start),
        end: Timestamp.fromDate(shift.end),
        enabled: shift.enabled,
        timeZone: shift.timeZone
    };
}

// FirestoreDataConverter for AngularFire
export const shiftConverter = {
    toFirestore: (shift: Shift) => fromShift(shift),
    fromFirestore: (snapshot: QueryDocumentSnapshot<DocumentData>, options: SnapshotOptions) => {
        const data = snapshot.data(options) as ShiftDoc;
        return toShift(snapshot.id, data);
    }
};
