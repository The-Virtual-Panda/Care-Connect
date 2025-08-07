import { Logger } from '@/utils/logger';

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

    helloWorld() {
        const apiFunction = httpsCallable(this.functions, 'getGreeting');
        apiFunction().then((result) => {
            Logger.log('getGreeting result:', result);
        });
    }

    navigateToBillingPortal() {
        const apiFunction = httpsCallable(this.functions, 'createStripeCustomerPortalSession');

        const orgId = this.authService.currentOrgId();
        if (!orgId) {
            Logger.error('No organization ID found. Cannot navigate to billing portal.');
            return;
        }

        const requestData: StripeBillingPortalRequestDto = {
            organizationId: orgId
        };

        Logger.log('Navigating to Stripe Billing Portal...');
        apiFunction(requestData).then((result: any) => {
            Logger.log('createStripeCustomerPortalSession result:', result);
            if (result && result.data.url) {
                window.open(result.data.url, '_blank');
            }
        });
    }
}
