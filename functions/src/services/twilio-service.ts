import { FirestoreService } from "./firestore-service";
import { matchShiftRule } from "./scheduling-service";
import { twiml as Twiml, validateRequest } from "twilio";
import { logger } from "firebase-functions";

export class TwilioService {
    constructor(private firestoreService: FirestoreService) { }

    /**
     * Handles a Twilio phone call and returns the TwiML XML response.
     */
    async handlePhoneCall(
        accountSid: string,
        toPhoneNumber: string,
        caller: string,
        callDate: Date,
        options?: {
            signature?: string,
            url?: string,
            params?: Record<string, any>
        }
    ): Promise<string> {
        // 1) Find the org by Twilio Account SID
        const org = await this.firestoreService.findOrgByTwilioAccountSid(accountSid);
        if (!org || !org.twilioAuthToken) {
            throw new Error("Unknown Twilio sub-account or missing auth token.");
        }

        // 2) Optionally validate the webhook request if signature, url, and params are provided
        if (options?.signature && options?.url && options?.params) {
            const isValid = this.validateWebhookRequest(
                org.twilioAuthToken,
                options.signature,
                options.url,
                options.params
            );
            if (!isValid) {
                throw new Error("Invalid Twilio webhook signature.");
            }
        }

        // 3) Fetch shifts for the phone number
        const shifts = await this.firestoreService.getShiftsForPhoneNumber(toPhoneNumber);

        // 4) Match the current shift
        const currentShift = matchShiftRule(callDate, shifts);

        // 5) Get the team member for the current shift
        const twiml = new Twiml.VoiceResponse();
        if (currentShift) {
            const forwardTo = await this.firestoreService.getTeamMemberById(org.id, currentShift.assigneeId);
            if (!forwardTo) {
                logger.error(`Corrupt data found, team member not found in org. Shift: ${currentShift.id}`);
                twiml.say("Sorry, the person on call has an issue with their phone number at this time.");
                twiml.hangup();
                return twiml.toString();
            }

            // If the caller is the same as the fallback number
            if (caller === forwardTo.phoneNumber) {
                logger.info(`Caller is the team member, not forwarding: ${caller}`);
                twiml.say("You are calling from the same number as the one on call. The call will now hangup.");
                twiml.pause({ length: 1 });
                twiml.hangup();
                return twiml.toString();
            }

            logger.info(`Forwarding call to team member: ${forwardTo.name} (${forwardTo.phoneNumber})`);
            twiml.dial(
                { timeout: 20 },
                forwardTo.phoneNumber
            );
            return twiml.toString();
        }

        const phone = await this.firestoreService.getPhoneNumber(toPhoneNumber);
        if (phone && phone.useFallbackForwardingNumber && phone.fallbackForwardingNumber) {
            // If the caller is the same as the fallback number
            if (caller === phone.fallbackForwardingNumber) {
                logger.info(`Caller is the fallback number, not forwarding: ${caller}`);
                twiml.say("There is no one active on-call. The number you called from is the same number as the default forwarding number. The call will now hangup.");
                twiml.pause({ length: 1 });
                twiml.hangup();
                return twiml.toString();
            }

            logger.info(`No current shift found, using fallback phone number: ${phone.fallbackForwardingNumber}`);
            twiml.dial(
                { timeout: 20 },
                phone.fallbackForwardingNumber
            );
            return twiml.toString();
        }

        logger.warn(`No shifts or phone number found for ${toPhoneNumber}`);
        twiml.say("Sorry, nobody is on call at this moment. Please call again later.");
        twiml.pause({ length: 1 });
        twiml.hangup();
        return twiml.toString();
    }

    /**
     * Validates a Twilio webhook request using the Twilio SDK.
     * Returns true if the request is valid, false otherwise.
     */
    validateWebhookRequest(
        authToken: string,
        signature: string,
        url: string,
        params: Record<string, any>
    ): boolean {
        return validateRequest(authToken, signature, url, params);
    }
}