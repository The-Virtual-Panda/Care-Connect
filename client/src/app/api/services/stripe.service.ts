import { Logger } from '@/utils/logger';
import { Observable, catchError, from, map, throwError } from 'rxjs';

import { Injectable, inject } from '@angular/core';
import { Functions, httpsCallable } from '@angular/fire/functions';

import { StripeBillingPortalRequestDto } from '../models/dto/stripe-billing-portal-request';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class StripeService {
    private functions = inject(Functions);
    private authService = inject(AuthService);

    getBillingPortalUrl(): Observable<string> {
        const orgId = this.authService.currentOrgId();
        if (!orgId) {
            Logger.error('No organization ID found. Cannot navigate to billing portal.');
            return throwError(() => new Error('No organization ID found.'));
        }

        const requestData: StripeBillingPortalRequestDto = {
            organizationId: orgId
        };

        Logger.log('Navigating to Stripe Billing Portal...');

        const apiFunction = httpsCallable(this.functions, 'createStripeCustomerPortalSession');
        return from(apiFunction(requestData)).pipe(
            map((result: any) => {
                Logger.log('createStripeCustomerPortalSession result:', result);
                if (result && result.data && result.data.url) {
                    return result.data.url as string;
                }

                throw new Error('No billing portal URL returned.');
            }),
            catchError((err) => {
                Logger.error('Error getting billing portal URL:', err);
                return throwError(() => err);
            })
        );
    }
}
