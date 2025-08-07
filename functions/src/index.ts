// Load environment variables from .env file
import * as dotenv from 'dotenv';
dotenv.config({ path: './.env' });

// ! Uncomment for debugging
// console.log(process.env);

export * from './twillio-functions';
export * from './local/retrieval-tests';
export * from './local/twilio-testing';
export * from './local/grant-role';
