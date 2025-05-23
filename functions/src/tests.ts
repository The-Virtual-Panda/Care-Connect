import { FirestoreService } from "./services/firestore-service";
import { logger } from "firebase-functions";
import { onRequest } from "firebase-functions/https";

// Only expose this function in local development
const isLocal = process.env.NODE_ENV === "dev";

export const testGetOrganizationByPhoneNumber = !isLocal ? undefined :
    onRequest(async (req, res) => {
        const phoneNumber = req.query.phoneNumber as string;
        logger.info(`Received request for phoneNumber: ${phoneNumber}`);
        if (!phoneNumber) {
            logger.warn("Missing phoneNumber query parameter");
            res.status(400).json({ error: "Missing phoneNumber query parameter" });
            return;
        }

        try {
            const firestoreService = new FirestoreService();
            const org = await firestoreService.getOrganizationByPhoneNumber(phoneNumber);
            logger.info(`Organization lookup result: ${JSON.stringify(org)}`);
            res.json({ organization: org });
        } catch (err) {
            logger.error("Error fetching organization by phone number", err);
            res.status(500).json({ error: err instanceof Error ? err.message : err });
        }
    });

export const testGetOrganizations = !isLocal ? undefined :
    onRequest(async (req, res) => {
        try {
            const firestoreService = new FirestoreService();
            const org = await firestoreService.getOrganizations();
            logger.info(`Organizations: ${JSON.stringify(org)}`);
            res.json({ organization: org });
        } catch (err) {
            logger.error("Error fetching organization by phone number", err);
            res.status(500).json({ error: err instanceof Error ? err.message : err });
        }
    });

export const testGetAllPhoneNumbers = !isLocal ? undefined :
    onRequest(async (req, res) => {
        try {
            const firestoreService = new FirestoreService();
            const phoneNumbers = await firestoreService.getAllPhoneNumbers();
            logger.info(`Phone numbers: ${JSON.stringify(phoneNumbers)}`);
            res.json({ phoneNumbers });
        } catch (err) {
            logger.error("Error fetching all phone numbers", err);
            res.status(500).json({ error: err instanceof Error ? err.message : err });
        }
    });