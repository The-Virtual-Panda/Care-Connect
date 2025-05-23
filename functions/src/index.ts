import { forwardCall, voicemail, handleRecording } from "./twillio";
import * as dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

export { forwardCall, voicemail, handleRecording };

// export const helloWorld = onRequest((request, response) => {
//     logger.info("Hello logs!", { structuredData: true });
//     response.send("Hello from Firebase!");
// });

