import {
    BaseSearchOptions,
    DateRangeFilter,
    PhoneNumberFilter,
} from '../search-options';
import { TwilioPagedResponse } from './twilio-generics';

// Twilio Call Resource (REST v2010)
// Docs: https://www.twilio.com/docs/voice/api/call-resource

/**
 * Search options for Twilio calls
 */
export interface TwilioCallSearchOptions
    extends BaseSearchOptions,
        DateRangeFilter,
        PhoneNumberFilter {
    status?: CallStatus;
    orgId?: string;
}

export interface TwilioCallListResponse extends TwilioPagedResponse {
    calls: CallResource[];
}

export type CallStatus =
    | 'queued'
    | 'ringing'
    | 'in-progress'
    | 'canceled'
    | 'completed'
    | 'failed'
    | 'busy'
    | 'no-answer';

export interface CallResource {
    /** The unique string that we created to identify this Call resource. */
    sid?: string;

    /** RFC 2822 string in UTC, e.g. "Mon, 01 Sep 2025 12:34:56 +0000" */
    dateCreated?: string;

    /** RFC 2822 string in UTC */
    dateUpdated?: string;

    /** Parent leg SID (CA...) if this call was created by another call */
    parentCallSid?: string;

    /** Account SID (AC...) */
    accountSid?: string;

    /** Destination (E.164, SIP URI, client:..., or sim:SID) */
    to?: string;
    /** Display-formatted destination */
    toFormatted?: string;

    /** Origin (E.164, SIP URI, client:..., or sim:SID) */
    from?: string;
    /** Display-formatted origin */
    fromFormatted?: string;

    /** PN... SID for inbound number or outgoing callerId */
    phoneNumberSid?: string;

    /** Current status */
    status?: CallStatus;

    /** RFC 2822 UTC start time (empty until dialed) */
    startTime?: string;

    /** RFC 2822 UTC end time (empty if not completed) */
    endTime?: string;

    /** Seconds, as a string (empty for busy/failed/no-answer/ongoing) */
    duration?: string;

    /** Charge for connectivity only (stringified decimal) */
    price?: string;

    /** ISO 4217 code, e.g. "USD" */
    priceUnit?: string;

    /** Call direction (see CallDirection) */
    direction?: string;

    /** "human" | "machine" when AMD was used; otherwise empty */
    answeredBy?: string;

    /** API version used to create the call, e.g. "2010-04-01" */
    apiVersion?: string;

    /** Forwarding number if carrier provided one */
    forwardedFrom?: string;

    /** Group SID (GP...) if associated */
    groupSid?: string;

    /** CNAM/caller name if lookup enabled and available */
    callerName?: string;

    /** Milliseconds queued before placement */
    queueTime?: string;

    /** Trunk SID (TK...) when placed via SIP trunk */
    trunkSid?: string;
}

export interface CallSubresourceUris {
    // Twilio returns a map of relative URIs; keys can vary by account/features.
    // Common keys include:
    recordings?: string;
    events?: string;
    notifications?: string;
    payments?: string;
    // Accept any additional subresource keys Twilio may add:
    [key: string]: string | undefined;
}
