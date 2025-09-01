import {
    CallInstance,
    CallStatus,
} from 'twilio/lib/rest/api/v2010/account/call';
import {
    BaseSearchOptions,
    DateRangeFilter,
    PhoneNumberFilter,
} from '../search-options';
import { TwilioPagedResponse } from './twilio-generics';

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
    calls: CallInstance[];
}
