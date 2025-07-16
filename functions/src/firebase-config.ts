import { credential } from 'firebase-admin';
import { getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { logger } from 'firebase-functions';

// Detect if running locally with emulator
const useEmulator = process.env.USE_EMULATOR === 'true';
const targetProdOverride = process.env.TARGET === 'prod';

// Logging
logger.info('Is using emulator:', useEmulator);
logger.info('Is targeting production:', targetProdOverride);

// Initialize the default app *once*
if (!getApps().length) {
    if (targetProdOverride) {
        const serviceAccountPath = process.env.SERVICE_ACCOUNT_PATH;
        const projectId = process.env.PROJECT_ID;
        if (!serviceAccountPath || !projectId) {
            throw new Error('Environment variable are not set.');
        } else {
            logger.info('Using service account path:', serviceAccountPath);
            logger.info('Using project ID:', projectId);
        }

        var serviceAccount = require(serviceAccountPath);
        initializeApp({
            projectId: projectId,
            credential: credential.cert(serviceAccount),
        });
    } else {
        initializeApp();
    }
}

export const fireDb = getFirestore();
export const auth = getAuth();

// Connect to Firestore emulator if USE_EMULATOR is true and FIRESTORE_EMULATOR_HOST is set
if (useEmulator && process.env.FIRESTORE_EMULATOR_HOST) {
    logger.info(
        'Connecting to Firestore emulators at:',
        process.env.FIRESTORE_EMULATOR_HOST
    );
    fireDb.settings({
        host: process.env.FIRESTORE_EMULATOR_HOST,
        ssl: false,
    });
} else {
    logger.info('Using production Firestore instance');
}
