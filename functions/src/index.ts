// Load environment variables from .env file
import * as dotenv from "dotenv";
dotenv.config();

// ! Just for debugging
// console.log(process.env)

export * from "./twillio";
export * from "./tests";

// export const helloWorld = onRequest((request, response) => {
//     logger.info("Hello logs!", { structuredData: true });
//     response.send("Hello from Firebase!");
// });

