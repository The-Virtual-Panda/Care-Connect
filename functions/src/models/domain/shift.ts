/**
 * A single call‐forward shift block.
 */
export interface Shift {
    /** UUID or Firestore doc ID */
    id: string;

    /** The user (or team) who’s on call during this block */
    assigneeId: string;

    /** E.164 phone number or internal device ID to forward to */
    forwardTo: string;

    /** Inclusive start date/time of the shift (local‐tz) */
    start: Date;

    /** Exclusive end date/time of the shift (local‐tz) */
    end: Date;

    /** Enable/disable this shift without deleting it */
    enabled: boolean;

    /** IANA time zone of this shift */
    timeZone: string;
}