import { PhoneUsageType } from "../enums/phone-usage-type";

export interface PhoneNumber {
    id: string;
    number: string;
    orgId: string;
    label?: string;
    usageType?: PhoneUsageType;
    dateCreated: Date;
    dateUpdated: Date;
}