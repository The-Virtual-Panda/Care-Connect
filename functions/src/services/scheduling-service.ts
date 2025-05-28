import { DateTime } from "luxon";
import { ScheduledRule } from "../models/domain/scheduled-rule";
import { ReoccurrenceFrequency } from "../models/enums/reoccurrence-frequency";
import { Shift } from "../models/domain/shift";

// — matcher function
export function matchScheduledRule(date: Date, time: string, rules: ScheduledRule[]): ScheduledRule | undefined {
    // throw error is time is not in HH:mm format
    const testTimeframe = DateTime.fromFormat(time, "HH:mm");
    if (!testTimeframe.isValid) {
        throw new Error(`Invalid time format: ${time}. Expected HH:mm.`);
    }

    return rules.find(rule => {
        if (!rule.enabled) return false;

        // Convert to Luxon DateTime in rule's timeZone
        const localDate = DateTime.fromObject(
            { year: date.getUTCFullYear(), month: date.getUTCMonth() + 1, day: date.getUTCDate() },
            { zone: rule.timeZone }
        );
        const localTime = DateTime.fromFormat(time, "HH:mm", { zone: rule.timeZone });

        // Check date bounds (ignore time)
        const scheduledStart = DateTime.fromObject(
            {
                year: rule.startDateUtc.getUTCFullYear(),
                month: rule.startDateUtc.getUTCMonth() + 1,
                day: rule.startDateUtc.getUTCDate()
            },
            { zone: rule.timeZone }
        ).startOf("day");

        let scheduledEnd: DateTime | undefined = undefined;
        if (rule.endDateUtc) {
            scheduledEnd = DateTime.fromObject(
                {
                    year: rule.endDateUtc.getUTCFullYear(),
                    month: rule.endDateUtc.getUTCMonth() + 1,
                    day: rule.endDateUtc.getUTCDate()
                },
                { zone: rule.timeZone }
            ).endOf("day");
        }

        // --- Standard date bounds check ---
        if (localDate < scheduledStart) return false;
        if (scheduledEnd && localDate > scheduledEnd) return false;

        // Check recurrence
        if (rule.freq === ReoccurrenceFrequency.Weekly && rule.byDay) {
            // Calculate weeks between rule start and current date
            const ruleWeekStart = scheduledStart.startOf("week");
            const currentWeekStart = localDate.startOf("week");
            const weeksBetween = Math.floor(currentWeekStart.diff(ruleWeekStart, "weeks").weeks);

            // fits the interval
            if (weeksBetween < 0 || weeksBetween % rule.interval !== 0) return false;

            // Check if the current date is in the list of allowed days
            if (!rule.byDay.includes(localDate.weekday)) return false;
        } else if (rule.freq === ReoccurrenceFrequency.Monthly && rule.byMonthDay) {
            // Calculate months between rule start and current date
            const ruleMonthStart = scheduledStart.startOf("month");
            const currentMonthStart = localDate.startOf("month");
            const monthsBetween = Math.floor(currentMonthStart.diff(ruleMonthStart, "months").months);

            // fits the interval
            if (monthsBetween < 0 || monthsBetween % rule.interval !== 0) return false;

            // Check if the current date is in the list of allowed days
            const dayOfMonth = localDate.day;
            if (!rule.byMonthDay.includes(dayOfMonth)) return false;
        }

        // --- Standard time window check ---
        if (!rule.allDay && rule.startTime && rule.endTime) {
            const start = DateTime.fromFormat(rule.startTime, "HH:mm", { zone: rule.timeZone });
            const end = DateTime.fromFormat(rule.endTime, "HH:mm", { zone: rule.timeZone });

            // Handle overnight windows (end <= start means it spans midnight)
            if (end <= start) {
                if (!(localTime >= start || localTime <= end)) return false;
            } else {
                if (!(localTime >= start && localTime <= end)) return false;
            }
        }

        return true;
    });
}

/**
 * Returns the forwardTo value for the shift covering the given date/time,
 * or `undefined` if no enabled shift matches.
 *
 * @param date   A JavaScript Date (with time) to check against shifts.
 * @param shifts An array of Shift objects.
 */
export function matchShiftRule(date: Date, shifts: Shift[] | null): Shift | undefined {
    if (!shifts || shifts.length === 0) return undefined;

    // Ensure deterministic behavior by checking shifts in chronological order
    const sorted = shifts
        .filter(s => s.enabled)
        .sort((a, b) => a.start.getTime() - b.start.getTime());

    const match = sorted.find(shift => {
        return date >= shift.start && date < shift.end;
    });

    return match;
}