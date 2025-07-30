import { Pipe, PipeTransform } from '@angular/core';

/**
 * Formats a phone number string into a readable format.
 * Accepts inputs like: 1234567890, (123) 456-7890, 123-456-7890
 * Outputs as: (123) 456-7890
 */
@Pipe({
    name: 'phone',
    standalone: true
})
export class PhonePipe implements PipeTransform {
    transform(phoneNumber: string | null | undefined): string {
        if (!phoneNumber) {
            return '';
        }

        // Remove all non-digit characters
        const digitsOnly = phoneNumber.replace(/\D/g, '');

        // Check if we have a valid 10-digit number
        if (digitsOnly.length === 10) {
            // Format as (XXX) XXX-XXXX
            return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6)}`;
        }

        // If not 10 digits, just return the original
        return phoneNumber;
    }
}
