// Load environment variables from .env file
import * as dotenv from "dotenv";
dotenv.config({ path: "./.env" });

// ! Just for debugging
// console.log(process.env)

export * from "./twillio";
export * from "./local/retrieval-tests";
export * from "./local/insertion-tests";
export * from "./local/twilio-testing";
