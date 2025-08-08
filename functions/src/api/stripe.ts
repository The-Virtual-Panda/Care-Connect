import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { logger } from 'firebase-functions/v2';
import {
    FirestoreCollections,
    FirestoreService,
} from '../services/firestore-service';
import { onDocumentWritten } from 'firebase-functions/firestore';
import Stripe from 'stripe';
import { Organization } from '../models/domain/organization';

const publicAppUrl = process.env.PUBLIC_APP_URL || '';
const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-07-30.basil', // ? Maybe I need to be more aware here?
});

// Callable function from the application to create a Stripe customer portal session
exports.createStripeCustomerPortalSession = onCall(
    { cors: [/firebase\.com$/, publicAppUrl] },
    async (request: any) => {
        logger.info('Received request for createStripeCustomerPortalSession');

        try {
            if (!request.auth || !request.auth.uid) {
                logger.warn('Unauthorized request', { request });
                return new HttpsError(
                    'unauthenticated',
                    'The function must be called while authenticated.'
                );
            }

            // Verify the request
            if (!request.data.organizationId) {
                logger.warn(
                    'Missing organizationId in request to createStripeCustomerPortalSession'
                );
                return new HttpsError(
                    'invalid-argument',
                    'The function must be called with a organizationId.'
                );
            }

            // TODO: Check for permission - do once roles & permissions implemented

            const organizationId = request.data.organizationId;

            // Fetch the organization document to get the Stripe customer ID
            const firestoreService = new FirestoreService();
            const org = await firestoreService.getOrganizationById(
                organizationId
            );

            if (!org) {
                logger.error(`Organization ${organizationId} not found`);
                return new HttpsError(
                    'not-found',
                    'The organization was not found.'
                );
            }

            if (!org.stripeCustomerId) {
                logger.error(
                    `Organization ${organizationId} is missing Stripe customer ID`,
                    { org }
                );
                return new HttpsError(
                    'failed-precondition',
                    'The organization is missing a Stripe customer ID.'
                );
            }

            const customerId = org.stripeCustomerId;
            logger.info(
                `Found Stripe customer ID: ${customerId} for organization ${organizationId}`
            );
            logger.info(
                `Creating Stripe customer portal session for organization ${organizationId}`
            );

            // Create a session for the customer portal
            const session = await stripeClient.billingPortal.sessions.create({
                customer: customerId,
                return_url: publicAppUrl,
            });

            logger.info('Stripe billing portal session created for customer', {
                customerId,
                sessionUrl: session.url,
            });

            return {
                success: true,
                url: session.url,
            };
        } catch (error) {
            logger.error('Error creating customer portal session', { error });
            throw new HttpsError(
                'internal',
                'An error occurred while creating the customer portal session.'
            );
        }
    }
);

exports.createStripeCustomer = onDocumentWritten(
    `${FirestoreCollections.organizations.root}/{docId}`,
    async (event) => {
        try {
            // Extract the document snapshot from the event
            const snapshot = event.data;
            if (!snapshot) {
                logger.warn(
                    'No data associated with the organization creation event'
                );
                return;
            }
            const organization = snapshot.after.data() as Organization;

            if (organization.stripeCustomerId) {
                logger.info('Stripe customer already exists for organization', {
                    organizationId: organization.id,
                    organizationName: organization.name,
                    stripeCustomerId: organization.stripeCustomerId,
                });
                return;
            }

            logger.info('Creating Stripe customer for organization', {
                organizationId: organization.id,
                organizationName: organization.name,
            });

            const customer = await stripeClient.customers.create({
                name: organization.name,
                metadata: {
                    organizationId: organization.id,
                },
            });

            logger.info(
                `Stripe customer created successfully: ${organization.name} / ${customer.id}`
            );

            const firestoreService = new FirestoreService();
            await firestoreService.updateOrganization(organization.id, {
                stripeCustomerId: customer.id,
            });
        } catch (error) {
            logger.error('Error creating Stripe customer', { error });
        }
    }
);

// exports.getGreeting = onCall(
//     { cors: [/firebase\.com$/, publicAppUrl] },
//     (request: any) => {
//         logger.info('getGreeting called', { request });
//         const message = 'Hello, world! Public URL: ' + publicAppUrl;
//         logger.info('getGreeting response', { message });

//         return message;
//     }
// );
