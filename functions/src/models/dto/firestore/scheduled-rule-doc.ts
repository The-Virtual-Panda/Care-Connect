import {
    FirestoreDataConverter,
    QueryDocumentSnapshot,
    WithFieldValue,
    Timestamp,
} from "firebase-admin/firestore";
import { ScheduledRule } from "../../domain/scheduled-rule";

/** Firestore‐shaped version of your ScheduledRule */
export interface ScheduledRuleDoc {
    enabled: boolean;
    forwardTo: string;
    startDate: Timestamp;
    endDate?: Timestamp;
    freq: number;
    interval: number;
    byDay?: number[];
    byMonthDay?: number[];
    startTime?: string;
    endTime?: string;
    allDay: boolean;
    timeZone: string;
}

/**
 * Convert Domain → Firestore
 */
export function toScheduledRuleDoc(
    p: WithFieldValue<ScheduledRule>
): ScheduledRuleDoc {
    return {
        enabled: p.enabled as boolean,
        forwardTo: p.forwardTo as string,
        startDate: Timestamp.fromDate(p.startDateUtc as Date),
        endDate: p.endDateUtc ? Timestamp.fromDate(p.endDateUtc as Date) : undefined,
        freq: p.freq as number,
        interval: p.interval as number,
        byDay: p.byDay as number[] | undefined,
        byMonthDay: p.byMonthDay as number[] | undefined,
        startTime: p.startTime as string | undefined,
        endTime: p.endTime as string | undefined,
        allDay: p.allDay as boolean,
        timeZone: p.timeZone as string,
    };
}

/**
 * Convert Firestore → Domain
 */
export function fromScheduledRuleDoc(doc: ScheduledRuleDoc, id: string): ScheduledRule {
    return {
        id,
        enabled: doc.enabled,
        forwardTo: doc.forwardTo,
        startDateUtc: doc.startDate.toDate(),
        endDateUtc: doc.endDate ? doc.endDate.toDate() : undefined,
        freq: doc.freq,
        interval: doc.interval,
        byDay: doc.byDay,
        byMonthDay: doc.byMonthDay,
        startTime: doc.startTime,
        endTime: doc.endTime,
        allDay: doc.allDay,
        timeZone: doc.timeZone,
    };
}

/** FirestoreDataConverter bound to your pure `ScheduledRule` type */
export const scheduledRuleConverter: FirestoreDataConverter<ScheduledRule> = {
    toFirestore: (p: WithFieldValue<ScheduledRule>) => toScheduledRuleDoc(p),
    fromFirestore: (snap: QueryDocumentSnapshot) =>
        fromScheduledRuleDoc(snap.data() as ScheduledRuleDoc, snap.id),
};