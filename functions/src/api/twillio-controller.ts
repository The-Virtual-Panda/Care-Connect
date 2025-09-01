import { HttpsError, onCall, onRequest } from 'firebase-functions/v2/https';
import * as logger from 'firebase-functions/logger';

import { FirestoreService } from '../services/firestore-service';
import { TwilioService } from '../services/twilio-service';
import { TwilioCallSearchOptions } from '../models/dto/twilio/twilio-calls';

const publicAppUrl = process.env.PUBLIC_APP_URL || '';

export const handleCall = onRequest(async (request, response) => {
    try {
        logger.info('Incoming request details:', {
            method: request.method,
            headers: request.headers,
            body: request.body,
            query: request.query,
        });

        const sig = request.headers['x-twilio-signature'] as string;
        const params = request.body;
        const url = `https://${request.hostname}${request.path}`;

        const firestoreService = new FirestoreService();
        const twilioService = new TwilioService(firestoreService);

        const accountSid = params.AccountSid as string;
        const fromPhoneNumber = params.From as string;
        const toPhoneNumber = (params.To as string).replace(/^\+/, '');
        const now = new Date();

        let twiml: string;
        try {
            twiml = await twilioService.handlePhoneCall(
                accountSid,
                toPhoneNumber,
                fromPhoneNumber,
                now,
                {
                    signature: sig,
                    url,
                    params,
                }
            );
        } catch (err: any) {
            if (
                err.message ===
                'Unknown Twilio sub-account or missing auth token.'
            ) {
                response.status(404).send('Unknown Twilio sub-account.');
                return;
            }
            if (err.message === 'Invalid Twilio webhook signature.') {
                logger.warn('Invalid Twilio signature', {
                    accountSid,
                    sig,
                    url,
                });
                response.status(403).send('Invalid signature.');
                return;
            }
            throw err;
        }

        response.set('Content-Type', 'text/xml');
        response.status(200).send(twiml);
    } catch (err) {
        logger.error('Error in handleCall:', err);
        response.status(500).send('Server error.');
    }
});

export const searchTwilioCalls = onCall(
    {
        invoker: 'public',
        cors: [/firebase\.com$/, publicAppUrl],
    },
    async (request: any) => {
        logger.info('Received request for searchTwilioCalls', {
            searchOptions: request.data,
        });

        try {
            if (!request.auth || !request.auth.uid) {
                logger.warn('Unauthorized request', { request });
                return new HttpsError(
                    'unauthenticated',
                    'The function must be called while authenticated.'
                );
            }

            // Validate search options
            const searchOptions: TwilioCallSearchOptions = request.data || {};

            // Set defaults if not provided
            const options: TwilioCallSearchOptions = {
                orgId: searchOptions.orgId,
                pageSize: searchOptions.pageSize || 50,
                pageNumber: searchOptions.pageNumber || 0,
                startDate: searchOptions.startDate,
                endDate: searchOptions.endDate,
                from: searchOptions.from,
                to: searchOptions.to,
                status: searchOptions.status,
            };

            // Verify the request
            if (!options.orgId) {
                logger.warn(
                    'Missing organizationId in request to searchTwilioCalls'
                );
                return new HttpsError(
                    'invalid-argument',
                    'Missing orgId in request to searchTwilioCalls.'
                );
            }

            // TODO: Check for permission - do once roles & permissions implemented

            // Fetch the organization document to get the Stripe customer ID
            const firestoreService = new FirestoreService();
            const org = await firestoreService.getOrganizationById(
                options.orgId
            );

            if (!org || !org.twilioAccountSid) {
                logger.error(`Organization ${options.orgId} not found`);
                return new HttpsError(
                    'not-found',
                    'The organization was not found or is not connected to Twilio.'
                );
            }

            logger.debug('Processing call search with options', { options });

            // Fetch calls from Twilio
            const twilioService = new TwilioService(firestoreService);
            const result = await twilioService.searchCalls(
                org.twilioAccountSid,
                options
            );

            logger.info('Successfully retrieved Twilio calls', {
                callCount: result.calls.length,
            });

            logger.debug('Twilio call search result', { result });

            return result;
        } catch (error: any) {
            logger.error('Error searching Twilio calls', {
                error: error.message,
                stack: error.stack,
            });

            throw new HttpsError(
                'internal',
                'An error occurred while searching Twilio calls.',
                { message: error.message }
            );
        }
    }
);
