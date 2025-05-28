import { PhoneUsageType } from "../enums/phone-usage-type";

export interface PhoneNumber {
    id: string;
    number: string;
    fallbackForwardingNumber?: string;
    useFallbackForwardingNumber?: boolean;
    orgId: string;
    label?: string;
    usageType?: PhoneUsageType;
    dateCreated: Date;
    dateUpdated: Date;
}