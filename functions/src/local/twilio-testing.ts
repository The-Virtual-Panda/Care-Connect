import { logger } from "firebase-functions";
import { FirestoreService } from "../services/firestore-service";
import { localOnRequest } from "./local-on-request";
import { TwilioService } from "../services/twilio-service";
import { DateTime } from "luxon";

export const simulateCall = localOnRequest(async (req, res) => {
    try {
        logger.info("Incoming local call request details:", {
            method: req.method,
            headers: req.headers,
            body: req.body,
            query: req.query,
        });

        const params = req.body;
        const accountSid = params.AccountSid as string;
        const toPhoneNumber = (params.To as string).replace(/^\+/, "");
        const fromPhoneNumber = params.From as string;

        // Allow passing a date string in "YYYY-MM-DDTHH:MM" format (assumed PST)
        let simulatedNow: Date;
        if (params.dateTime) {
            // Parse as America/Los_Angeles, then convert to UTC JS Date
            simulatedNow = DateTime.fromISO(params.dateTime, { zone: "America/Los_Angeles" }).toUTC().toJSDate();
        } else {
            simulatedNow = new Date();
        }
        logger.info("Simulated date (UTC):", simulatedNow.toISOString());

        const firestoreService = new FirestoreService();
        const twilioService = new TwilioService(firestoreService);

        let twiml: string;
        try {
            twiml = await twilioService.handlePhoneCall(accountSid, toPhoneNumber,
                fromPhoneNumber, simulatedNow);
        } catch (err: any) {
            if (err.message === "Unknown Twilio sub-account or missing auth token.") {
                res.status(404).send("Unknown Twilio sub-account.");
                return;
            }
            throw err;
        }

        res.set("Content-Type", "text/xml");
        res.status(200).send(twiml);
    } catch (err) {
        logger.error("Error in handleLocalCall:", err);
        res.status(500).send("Server error.");
    }
});
