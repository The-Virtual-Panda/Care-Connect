// Load environment variables from .env file
import * as dotenv from "dotenv";
dotenv.config();

// ! Just for debugging
// console.log(process.env)

export * from "./twillio";
export * from "./tests/retrieval-tests";

