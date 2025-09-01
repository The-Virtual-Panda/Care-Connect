/**
 * Client-side Twilio call interface with all properties explicitly defined
 */
export interface TwilioCall {
    // Call identifiers
    sid: string;
    accountSid: string;
    parentCallSid?: string;

    // Call participants
    from: string;
    fromFormatted?: string;
    to: string;
    toFormatted?: string;

    // Timing information
    startTime: string; // ISO date string
    endTime?: string; // ISO date string
    dateCreated: string;
    dateUpdated: string;
    duration?: number; // in seconds

    // Call status and direction
    status: TwilioCallStatus;
    direction: 'inbound' | 'outbound-api' | 'outbound-dial';

    // Call pricing
    price?: number;
    priceUnit?: string;

    // Call routing
    forwardedFrom?: string;
    callerName?: string;

    // Additional metadata
    apiVersion: string;
    annotation?: string;
    answeredBy?: string;
    groupSid?: string;
    queueTime?: number;
    trunkSid?: string;
    uri: string;
}

/**
 * Twilio call status values
 */
export type TwilioCallStatus = 'queued' | 'ringing' | 'in-progress' | 'completed' | 'busy' | 'failed' | 'no-answer' | 'canceled';

/**
 * Search options for Twilio calls with all fields explicitly defined
 */
export interface TwilioCallSearchOptions {
    // Pagination parameters
    pageSize?: number;
    pageNumber?: number;

    // Date range filters
    startDate?: string; // ISO date string for filtering calls after this date
    endDate?: string; // ISO date string for filtering calls before this date

    // Phone number filters
    from?: string; // Filter by the caller's phone number
    to?: string; // Filter by the recipient's phone number

    // Call status filter
    status?: TwilioCallStatus | TwilioCallStatus[]; // Filter by one or more call statuses

    // Organization filter
    orgId: string;
}

/**
 * Response for Twilio call list
 */
export interface TwilioCallListResponse {
    // Call records
    calls: TwilioCall[];

    // Pagination information
    pagination: {
        totalCount: number; // Total number of calls matching the criteria
        pageSize: number; // Number of calls per page
        pageNumber: number; // Current page number (1-based)
        totalPages: number; // Total number of pages available
    };

    // URI references for navigating pages
    uri: string; // Current page URI
    firstPageUri: string; // First page URI
    nextPageUri: string | null; // Next page URI or null if on last page
    previousPageUri: string | null; // Previous page URI or null if on first page
}
