/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
// import { getFirestore } from "firebase-admin/firestore";

import twilio from "twilio";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// Phone numbers
const forwardingNumber = "+12532298444";

export const forwardCall = onRequest(async (request, response) => {
    try {
        const { From } = request.body; // The caller's phone number

        logger.info(`Incoming call from: ${From}`);

        // Create a TwiML response to forward the call
        const twiml = new twilio.twiml.VoiceResponse();
        twiml.say('Hit the endpoint to forward the call.');
        twiml.dial(forwardingNumber);

        response.set("Content-Type", "text/xml");
        response.status(200).send(twiml.toString());
    } catch (error) {
        logger.error("Error forwarding call:", error);
        response.status(500).send("Failed to forward the call.");
    }
});
