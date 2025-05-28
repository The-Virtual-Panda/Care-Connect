import { ReoccurrenceFrequency } from "../enums/reoccurrence-frequency";
import { Weekday } from "../enums/weekday";

export interface ScheduledRule {
    id: string;                   // UUID
    enabled: boolean;             // toggle rule on/off
    forwardTo: string;              // E.164 or Device ID

    /** Required date bounds: */
    startDateUtc: Date;                // “no earlier than…”
    endDateUtc?: Date;                // optional “until…”

    /** Recurrence pattern: */
    freq: ReoccurrenceFrequency;
    interval: number;              // e.g. every 1 week, every 2 months

    /** Only for weekly freq: which days of week */
    byDay?: Weekday[];

    /** Only for monthly freq: which days of month */
    byMonthDay?: number[];           // [1,15,30] etc.

    /** Daily time window (in local tz). Uses HH:mm  */
    startTime?: string;              // "07:00"
    endTime?: string;              // "07:00"
    allDay: boolean;
    // if endTime ≤ startTime → spans to next day

    // IANA, e.g. "America/Sao_Paulo"
    timeZone: string;
}