import { credential } from "firebase-admin";
import { getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { logger } from "firebase-functions";

// Detect if running locally with emulator
const isEmulator = process.env.USE_EMULATOR === "true";

// Target environment
const useProd = process.env.TARGET === "prod";

// Initialize the default app *once*
if (!getApps().length) {
    if (useProd) {
        const serviceAccountPath = process.env.SERVICE_ACCOUNT_PATH;
        const projectId = process.env.PROJECT_ID;
        if (!serviceAccountPath || !projectId) {
            throw new Error("Environment variable are not set.");
        }

        var serviceAccount = require(serviceAccountPath);
        initializeApp({
            projectId: projectId,
            credential: credential.cert(serviceAccount)
        });
    }
    else {
        initializeApp();
    }
}

export const fireDb = getFirestore();
export const auth = getAuth();

// Connect to Firestore emulator if FIRESTORE_EMULATOR_HOST is set
if (isEmulator) {
    logger.info("Connecting to Firestore emulators...");
    fireDb.settings({
        host: process.env.FIRESTORE_EMULATOR_HOST,
        ssl: false,
    });
}