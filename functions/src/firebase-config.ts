import { getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";


// Initialize the default app *once*
if (!getApps().length) {
    initializeApp();
}

export const fireDb = getFirestore();
export const auth = getAuth();