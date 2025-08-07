import * as dotenv from 'dotenv';

// Load environment variables from .env file only in development
// * Firebase will use the right env based on the project target "--project target"
// * But, the local setup will not have that loaded
if (process.env.USERNAME === 'brent') {
    dotenv.config({ path: './.env.local' });

    // ! Uncomment for debugging
    //console.log(process.env);
}

export * from './api/twillio';
export * from './api/stripe';
export * from './local/retrieval-tests';
export * from './local/twilio-testing';
export * from './local/grant-role';
