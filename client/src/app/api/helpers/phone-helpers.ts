// Utility functions for phone number formatting
export function addCountryCode(phoneNumber: string): string {
    if (!phoneNumber) return phoneNumber;
    // If phone number doesn't start with +1, add it
    return phoneNumber.startsWith('+1') ? phoneNumber : `+1${phoneNumber}`;
}

export function removeCountryCode(phoneNumber: string): string {
    if (!phoneNumber) return phoneNumber;
    // If phone number starts with +1, remove it
    return phoneNumber.startsWith('+1') ? phoneNumber.substring(2) : phoneNumber;
}
