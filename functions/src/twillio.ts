import { onRequest } from 'firebase-functions/v2/https';
import * as logger from 'firebase-functions/logger';

import { FirestoreService } from './services/firestore-service';
import { TwilioService } from './services/twilio-service';

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
