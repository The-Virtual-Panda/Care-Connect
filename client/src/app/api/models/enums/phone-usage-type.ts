export enum PhoneUsageType {
    SimpleForward = 1,
    ScheduledForwarding = 2,
    Shifts = 3
}

export namespace PhoneUsageType {
    export const values: PhoneUsageType[] = Object.values(PhoneUsageType).filter((v): v is PhoneUsageType => typeof v === 'number');

    export function display(type: PhoneUsageType): string {
        switch (type) {
            case PhoneUsageType.SimpleForward:
                return 'Simple Forward';
            case PhoneUsageType.ScheduledForwarding:
                return 'Scheduled Forwarding';
            case PhoneUsageType.Shifts:
                return 'Shifts';
            default:
                return String(type);
        }
    }
}
