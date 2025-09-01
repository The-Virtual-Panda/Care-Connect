import { OrgContextService } from '@/services/org-context.service';
import { Logger } from '@/utils/logger';
import { Observable, catchError, from, map, throwError } from 'rxjs';

import { Injectable, inject } from '@angular/core';
import { Functions, httpsCallable } from '@angular/fire/functions';

import { TwilioCallListResponse, TwilioCallSearchOptions } from '../models/dto/twilio-calls';

@Injectable({
    providedIn: 'root'
})
export class TwilioService {
    private functions = inject(Functions);
    private orgContextService = inject(OrgContextService);

    /**
     * Retrieve call history based on search criteria
     * @param searchOptions Options to filter calls
     * @returns Observable of TwilioCallListResponse containing call history
     */
    getCallHistory(searchOptions: Partial<TwilioCallSearchOptions> = {}): Observable<TwilioCallListResponse> {
        // Get current organization ID if not specified in search options
        const orgId = searchOptions.orgId || this.orgContextService.routeOrgId();
        if (!orgId) {
            Logger.error('No organization ID found. Cannot retrieve call history.');
            return throwError(() => new Error('No organization ID found.'));
        }

        // Create search request with defaults
        const request: TwilioCallSearchOptions = {
            orgId,
            pageSize: searchOptions.pageSize || 20,
            pageNumber: searchOptions.pageNumber || 1,
            ...searchOptions
        };

        Logger.log('Retrieving Twilio call history with options:', request);

        // Call the Cloud Function
        const apiFunction = httpsCallable(this.functions, 'searchTwilioCalls');
        return from(apiFunction(request)).pipe(
            map((result: any) => {
                Logger.log('searchTwilioCalls result:', result);
                if (result && result.data) {
                    return result.data as TwilioCallListResponse;
                }

                throw new Error('Invalid call history response format.');
            }),
            catchError((error) => {
                Logger.error('Error retrieving call history:', error);
                return throwError(() => error);
            })
        );
    }
}
