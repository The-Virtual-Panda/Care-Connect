import { FirestoreService } from "../services/firestore-service";
import { logger } from "firebase-functions";
import { localOnRequest } from "./local-on-request";

export const testGetOrganizationByPhoneNumber = localOnRequest(async (req, res) => {
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

export const testGetOrganizations = localOnRequest(async (req, res) => {
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

export const testGetAllPhoneNumbers = localOnRequest(async (req, res) => {
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

export const testGetScheduledRules = localOnRequest(async (req, res) => {
    const phoneNumber = req.query.phoneNumber as string;
    logger.info(`Received request for phoneNumber: ${phoneNumber}`);
    if (!phoneNumber) {
        logger.warn("Missing phoneNumber query parameter");
        res.status(400).json({ error: "Missing phoneNumber query parameter" });
        return;
    }

    try {
        const firestoreService = new FirestoreService();
        const scheduledRules = await firestoreService.getScheduledRulesForPhoneNumber(phoneNumber);
        logger.info(`Scheduled rules: ${JSON.stringify(scheduledRules)}`);
        res.json({ scheduledRules });
    } catch (err) {
        logger.error("Error fetching scheduled rules", err);
        res.status(500).json({ error: err instanceof Error ? err.message : err });
    }
});

export const testGetShiftRules = localOnRequest(async (req, res) => {
    const phoneNumber = req.query.phoneNumber as string;
    logger.info(`Received request for phoneNumber: ${phoneNumber}`);
    if (!phoneNumber) {
        logger.warn("Missing phoneNumber query parameter");
        res.status(400).json({ error: "Missing phoneNumber query parameter" });
        return;
    }

    try {
        const firestoreService = new FirestoreService();
        const shifts = await firestoreService.getShiftsForPhoneNumber(phoneNumber);
        logger.info(`Shift rules: ${JSON.stringify(shifts)}`);
        res.json({ shifts });
    } catch (err) {
        logger.error("Error fetching shift rules", err);
        res.status(500).json({ error: err instanceof Error ? err.message : err });
    }
});