/**
 * A single call‐forward shift block.
 */
export interface Shift {
    /** UUID or Firestore doc ID */
    id: string;

    /** The Team Member Id who’s on call during this block */
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