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

import twilio from "twilio";

// Twilio credentials
const accountSid = process.env.TWILIO_ACCOUNT_SID as string;
const authToken = process.env.TWILIO_AUTH_TOKEN as string;

if (!accountSid || !authToken) {
    throw new Error("Twilio credentials are not set in environment variables.");
}

twilio(accountSid, authToken);

// Phone numbers
const forwardingNumber = "+12532298444";

export const forwardCall = onRequest(async (request, response) => {
    try {
        // Log incoming request details
        logger.info("Incoming request details:", {
            method: request.method,
            headers: request.headers,
            body: request.body,
            query: request.query,
        });

        // Construct the full URL for validation
        const functionName = "forwardCall";
        const url = `https://${request.hostname}/${functionName}`;
        logger.info("Constructed URL for validation:", { url });

        // Validate the Twilio request
        const twilioSignature = request.headers["x-twilio-signature"] as string;
        const params = request.body;

        const isValidRequest = twilio.validateRequest(authToken, twilioSignature, url, params);

        if (!isValidRequest) {
            logger.warn("Invalid Twilio request received.", {
                signature: twilioSignature,
                url,
                params,
            });
            response.status(403).send("Invalid request.");
            return;
        }

        const { From } = request.body;

        logger.info("Valid Twilio request received.", {
            caller: From,
            forwardingNumber,
        });

        const twiml = new twilio.twiml.VoiceResponse();

        // Try to dial the on-call number for 20s, then fall back
        twiml.dial(
            { action: "/voicemail", timeout: 20 },
            forwardingNumber
        );
        // If Dial fails to hit /voicemail (rare), redirect there
        twiml.redirect("/voicemail");

        response.set("Content-Type", "text/xml");
        response.status(200).send(twiml.toString());
    } catch (error) {
        logger.error("Internal Error forwarding call:", error);
        response.status(500).send("Failed to forward the call.");
    }
});

export const voicemail = onRequest(async (request, response) => {
    const { DialCallStatus } = request.body;
    const twiml = new twilio.twiml.VoiceResponse();

    if (DialCallStatus !== "completed") {
        twiml.say(
            "Sorry, nobody is available. Please leave a message after the tone. " +
            "Press pound when finished."
        );
        twiml.record({
            maxLength: 120,
            finishOnKey: "#",
            action: "/handleRecording",
        });
    } else {
        twiml.hangup();
    }

    response.type("text/xml").send(twiml.toString());
});

export const handleRecording = onRequest(async (request, response) => {
    // TODO: save or notify with recordingUrl
    // const recordingUrl = request.body.RecordingUrl;
    const twiml = new twilio.twiml.VoiceResponse();
    twiml.say("Thanks, goodbye.");
    response.type("text/xml").send(twiml.toString());
});