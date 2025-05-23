// models/domain.ts

/** A postal address used for billing (e.g. Twilio emergency address) */
export interface Address {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
}





