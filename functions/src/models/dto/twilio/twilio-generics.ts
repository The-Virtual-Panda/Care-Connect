/**
 * Mimics Twilio's pagination object structure from their API responses.
 * See Twilio docs: https://www.twilio.com/docs/usage/twilios-response#pagination
 */
export interface TwilioPagedResponse {
    //uri: string;
    //firstPageUri: string;
    nextPageUri?: string | null;
    previousPageUri?: string | null;
    page: number;
    pageSize: number;
}
