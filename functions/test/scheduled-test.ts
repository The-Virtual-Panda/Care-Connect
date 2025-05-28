import { ScheduledRule } from "../src/models/domain/scheduled-rule";
import { ReoccurrenceFrequency } from "../src/models/enums/reoccurrence-frequency";
import { Weekday } from "../src/models/enums/weekday";
import { matchScheduledRule } from "../src/services/scheduling-service";

// ! This is currently not functional.

function testDay(
    date: Date,
    time: string,
    rules: ScheduledRule[],
    expected?: string
) {
    const foundRule = matchScheduledRule(date, time, rules);
    const result = foundRule ? foundRule.forwardTo : "N/A";

    if (expected === undefined) {
        console.log(`Day: ${date.toISOString().slice(0, 10)}, Time: ${time}, result: ${result}`);
        return;
    } else {
        console.assert(result === expected, `Test failed for ${date.toISOString().slice(0, 10)}, Time: ${time}: expected ${expected}, got ${result}`);
    }
}

const june2025Rules: ScheduledRule[] = [
    // Carolyn: every Thu/Fri/Sat/Sun from Jun 1 → Jun 15
    {
        id: "rule-c-weekly-1",
        enabled: true,
        forwardTo: "Carolyn",
        startDateUtc: new Date("2025-06-01"),
        endDateUtc: new Date("2025-06-16"),
        freq: ReoccurrenceFrequency.Weekly,
        interval: 1,
        byDay: [
            Weekday.Sunday,
            Weekday.Thursday,
            Weekday.Friday,
            Weekday.Saturday
        ],
        startTime: "07:00",
        endTime: "06:59",
        allDay: false,
        timeZone: "America/Los_Angeles"
    },

    // Shannon: every Mon/Tue/Wed from Jun 2 → Jun 11
    {
        id: "rule-s-weekly-1",
        enabled: true,
        forwardTo: "Shannon",
        startDateUtc: new Date("2025-06-02"),
        endDateUtc: new Date("2025-06-11"),
        freq: ReoccurrenceFrequency.Weekly,
        interval: 1,
        byDay: [
            Weekday.Monday,
            Weekday.Tuesday,
            Weekday.Wednesday
        ],
        startTime: "07:00",
        endTime: "06:59",
        allDay: false,
        timeZone: "America/Los_Angeles"
    },

    // Shannon override block: Jun 16 → Jun 22 (every day)
    {
        id: "rule-s-jun16-22",
        enabled: true,
        forwardTo: "Shannon",
        startDateUtc: new Date("2025-06-16"),
        endDateUtc: new Date("2025-06-22"),
        freq: ReoccurrenceFrequency.Daily,
        interval: 1,
        startTime: "07:00",
        endTime: "06:59",
        allDay: false,
        timeZone: "America/Los_Angeles"
    },

    // Carolyn mini-block: Jun 23 → Jun 24
    {
        id: "rule-c-jun23-24",
        enabled: true,
        forwardTo: "Carolyn",
        startDateUtc: new Date("2025-06-23"),
        endDateUtc: new Date("2025-06-24"),
        freq: ReoccurrenceFrequency.Daily,
        interval: 1,
        startTime: "07:00",
        endTime: "06:59",
        allDay: false,
        timeZone: "America/Los_Angeles"
    },

    // Shannon mini-block: Jun 25 → Jun 26
    {
        id: "rule-s-jun25-26",
        enabled: true,
        forwardTo: "Shannon",
        startDateUtc: new Date("2025-06-25"),
        endDateUtc: new Date("2025-06-26"),
        freq: ReoccurrenceFrequency.Daily,
        interval: 1,
        startTime: "07:00",
        endTime: "06:59",
        allDay: false,
        timeZone: "America/Los_Angeles"
    },

    // Carolyn mini-block: Jun 27 → Jun 29
    {
        id: "rule-c-jun27-29",
        enabled: true,
        forwardTo: "Carolyn",
        startDateUtc: new Date("2025-06-27"),
        endDateUtc: new Date("2025-06-29"),
        freq: ReoccurrenceFrequency.Daily,
        interval: 1,
        startTime: "07:00",
        endTime: "06:59",
        allDay: false,
        timeZone: "America/Los_Angeles"
    },

    // Shannon one-off: Jun 30
    {
        id: "rule-s-jun30",
        enabled: true,
        forwardTo: "Shannon",
        startDateUtc: new Date("2025-06-30"),
        endDateUtc: new Date("2025-06-30"),
        freq: ReoccurrenceFrequency.Daily,
        interval: 1,
        allDay: true,
        timeZone: "America/Los_Angeles"
    }
];


// — run tests for each day in June 2025
// for (let day = 1; day <= 30; day++) {
//     const dt = new Date(Date.UTC(2025, 5, day));
//     testDay(dt, "11:59", june2025Rules);
// }

testDay(new Date(Date.UTC(2025, 5, 1)), "07:00", june2025Rules, "Carolyn");
testDay(new Date(Date.UTC(2025, 5, 2)), "06:59", june2025Rules, "Carolyn");
testDay(new Date(Date.UTC(2025, 5, 2)), "07:00", june2025Rules, "Shannon");
testDay(new Date(Date.UTC(2025, 5, 3)), "06:59", june2025Rules, "Shannon");
testDay(new Date(Date.UTC(2025, 5, 3)), "07:00", june2025Rules, "Shannon");
testDay(new Date(Date.UTC(2025, 5, 4)), "06:59", june2025Rules, "Shannon");
testDay(new Date(Date.UTC(2025, 5, 4)), "07:00", june2025Rules, "Shannon");
testDay(new Date(Date.UTC(2025, 5, 5)), "06:59", june2025Rules, "Shannon");
testDay(new Date(Date.UTC(2025, 5, 5)), "07:00", june2025Rules, "Carolyn");
testDay(new Date(Date.UTC(2025, 5, 6)), "06:59", june2025Rules, "Carolyn");
testDay(new Date(Date.UTC(2025, 5, 6)), "07:00", june2025Rules, "Carolyn");
testDay(new Date(Date.UTC(2025, 5, 7)), "06:59", june2025Rules, "Carolyn");
testDay(new Date(Date.UTC(2025, 5, 7)), "07:00", june2025Rules, "Carolyn");
testDay(new Date(Date.UTC(2025, 5, 8)), "06:59", june2025Rules, "Carolyn");
testDay(new Date(Date.UTC(2025, 5, 8)), "07:00", june2025Rules, "Carolyn");
testDay(new Date(Date.UTC(2025, 5, 9)), "06:59", june2025Rules, "Carolyn");
testDay(new Date(Date.UTC(2025, 5, 9)), "07:00", june2025Rules, "Shannon");
testDay(new Date(Date.UTC(2025, 5, 10)), "06:59", june2025Rules, "Shannon");
testDay(new Date(Date.UTC(2025, 5, 10)), "07:00", june2025Rules, "Shannon");
testDay(new Date(Date.UTC(2025, 5, 11)), "06:59", june2025Rules, "Shannon");
testDay(new Date(Date.UTC(2025, 5, 11)), "07:00", june2025Rules, "Shannon");
testDay(new Date(Date.UTC(2025, 5, 12)), "06:59", june2025Rules, "Shannon");
testDay(new Date(Date.UTC(2025, 5, 12)), "07:00", june2025Rules, "Carolyn");
testDay(new Date(Date.UTC(2025, 5, 13)), "06:59", june2025Rules, "Carolyn");
testDay(new Date(Date.UTC(2025, 5, 13)), "07:00", june2025Rules, "Carolyn");
testDay(new Date(Date.UTC(2025, 5, 14)), "06:59", june2025Rules, "Carolyn");
testDay(new Date(Date.UTC(2025, 5, 14)), "07:00", june2025Rules, "Carolyn");
testDay(new Date(Date.UTC(2025, 5, 15)), "06:59", june2025Rules, "Carolyn");
testDay(new Date(Date.UTC(2025, 5, 15)), "07:00", june2025Rules, "Carolyn");
testDay(new Date(Date.UTC(2025, 5, 16)), "06:59", june2025Rules, "Carolyn");
testDay(new Date(Date.UTC(2025, 5, 16)), "07:00", june2025Rules, "Shannon");
testDay(new Date(Date.UTC(2025, 5, 17)), "06:59", june2025Rules, "Shannon");
testDay(new Date(Date.UTC(2025, 5, 17)), "07:00", june2025Rules, "Shannon");
testDay(new Date(Date.UTC(2025, 5, 18)), "06:59", june2025Rules, "Shannon");
testDay(new Date(Date.UTC(2025, 5, 18)), "07:00", june2025Rules, "Shannon");
testDay(new Date(Date.UTC(2025, 5, 19)), "06:59", june2025Rules, "Shannon");
testDay(new Date(Date.UTC(2025, 5, 19)), "07:00", june2025Rules, "Shannon");
testDay(new Date(Date.UTC(2025, 5, 20)), "06:59", june2025Rules, "Shannon");
testDay(new Date(Date.UTC(2025, 5, 20)), "07:00", june2025Rules, "Shannon");
testDay(new Date(Date.UTC(2025, 5, 21)), "06:59", june2025Rules, "Shannon");
testDay(new Date(Date.UTC(2025, 5, 21)), "07:00", june2025Rules, "Shannon");
testDay(new Date(Date.UTC(2025, 5, 22)), "06:59", june2025Rules, "Shannon");
testDay(new Date(Date.UTC(2025, 5, 22)), "07:00", june2025Rules, "Shannon");
testDay(new Date(Date.UTC(2025, 5, 23)), "06:59", june2025Rules, "Shannon");
testDay(new Date(Date.UTC(2025, 5, 23)), "07:00", june2025Rules, "Carolyn");
testDay(new Date(Date.UTC(2025, 5, 24)), "06:59", june2025Rules, "Carolyn");
testDay(new Date(Date.UTC(2025, 5, 24)), "07:00", june2025Rules, "Carolyn");
testDay(new Date(Date.UTC(2025, 5, 25)), "06:59", june2025Rules, "Carolyn");
testDay(new Date(Date.UTC(2025, 5, 25)), "07:00", june2025Rules, "Shannon");
testDay(new Date(Date.UTC(2025, 5, 26)), "06:59", june2025Rules, "Shannon");
testDay(new Date(Date.UTC(2025, 5, 26)), "07:00", june2025Rules, "Shannon");
testDay(new Date(Date.UTC(2025, 5, 27)), "06:59", june2025Rules, "Shannon");
testDay(new Date(Date.UTC(2025, 5, 27)), "07:00", june2025Rules, "Carolyn");
testDay(new Date(Date.UTC(2025, 5, 28)), "06:59", june2025Rules, "Carolyn");
testDay(new Date(Date.UTC(2025, 5, 28)), "07:00", june2025Rules, "Carolyn");
testDay(new Date(Date.UTC(2025, 5, 29)), "06:59", june2025Rules, "Carolyn");
testDay(new Date(Date.UTC(2025, 5, 29)), "07:00", june2025Rules, "Carolyn");
testDay(new Date(Date.UTC(2025, 5, 30)), "06:59", june2025Rules, "Carolyn");
testDay(new Date(Date.UTC(2025, 5, 30)), "07:00", june2025Rules, "Shannon");