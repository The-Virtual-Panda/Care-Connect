import { initializeApp } from "firebase-admin/app";
// import { getFirestore } from "firebase-admin/firestore";
import { forwardCall, voicemail, handleRecording } from "./twillio";

initializeApp();

export { forwardCall, voicemail, handleRecording };

// export const helloWorld = onRequest((request, response) => {
//     logger.info("Hello logs!", { structuredData: true });
//     response.send("Hello from Firebase!");
// });

