import { getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { logger } from "firebase-functions";

// Detect if running locally with emulator
const isEmulator = process.env.USE_EMULATOR === "true";

// Initialize the default app *once*
if (!getApps().length) {
    initializeApp();
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