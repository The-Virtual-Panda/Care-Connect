import { DateTime } from "luxon";
import { Shift } from "../src/models/domain/shift";
import { matchShiftRule } from "../src/services/scheduling-service";

/**
 * Test a shift for a given PST datetime string (YYYY-MM-DDTHH:mm).
 * Converts the input from America/Los_Angeles to UTC JS Date for matching.
 */
function testDay(
    dateTimeStr: string, // expects "YYYY-MM-DDTHH:mm"
    shifts: Shift[],
    expected?: string
) {
    // Parse as PST, then convert to UTC JS Date
    const dt = DateTime.fromISO(dateTimeStr, { zone: "America/Los_Angeles" }).toUTC();
    const date = dt.toJSDate();

    const foundRule = matchShiftRule(date, shifts);
    const result = foundRule ? foundRule.assigneeId : "N/A";

    if (expected === undefined) {
        console.log(`Day: ${dateTimeStr}, result: ${result}`);
        return;
    } else {
        console.assert(result === expected, `Test failed for ${dateTimeStr}: expected ${expected}, got ${result}`);
    }
}

const janeSmithId = "OFmyDMeOdQGNOhfYtEbE";
const shannonId = "Y3mwpCjhIi0rnrhKo4nw";

export const testShifts: Shift[] = [
    // C: Jun 1 → Jun 2
    {
        id: "shift-2025-06-01",
        assigneeId: janeSmithId,
        start: new Date("2025-06-01T07:00:00-07:00"),
        end: new Date("2025-06-02T07:00:00-07:00"),
        enabled: true,
        timeZone: "America/Los_Angeles"
    },

    // S: Jun 2 → Jun 5 (covers 2,3,4)
    {
        id: "shift-2025-06-02-04",
        assigneeId: shannonId,
        start: new Date("2025-06-02T07:00:00-07:00"),
        end: new Date("2025-06-05T07:00:00-07:00"),
        enabled: true,
        timeZone: "America/Los_Angeles"
    },

    // C: Jun 5 → Jun 9 (covers 5,6,7,8)
    {
        id: "shift-2025-06-05-08",
        assigneeId: janeSmithId,
        start: new Date("2025-06-05T07:00:00-07:00"),
        end: new Date("2025-06-09T07:00:00-07:00"),
        enabled: true,
        timeZone: "America/Los_Angeles"
    },

    // S: Jun 9 → Jun 12 (covers 9,10,11)
    {
        id: "shift-2025-06-09-11",
        assigneeId: shannonId,
        start: new Date("2025-06-09T07:00:00-07:00"),
        end: new Date("2025-06-12T07:00:00-07:00"),
        enabled: true,
        timeZone: "America/Los_Angeles"
    },

    // C: Jun 12 → Jun 16 (covers 12,13,14,15)
    {
        id: "shift-2025-06-12-15",
        assigneeId: janeSmithId,
        start: new Date("2025-06-12T07:00:00-07:00"),
        end: new Date("2025-06-16T07:00:00-07:00"),
        enabled: true,
        timeZone: "America/Los_Angeles"
    },

    // S: Jun 16 → Jun 23 (covers 16–22)
    {
        id: "shift-2025-06-16-22",
        assigneeId: shannonId,
        start: new Date("2025-06-16T07:00:00-07:00"),
        end: new Date("2025-06-23T07:00:00-07:00"),
        enabled: true,
        timeZone: "America/Los_Angeles"
    },

    // C: Jun 23 → Jun 25 (covers 23,24)
    {
        id: "shift-2025-06-23-24",
        assigneeId: janeSmithId,
        start: new Date("2025-06-23T07:00:00-07:00"),
        end: new Date("2025-06-25T07:00:00-07:00"),
        enabled: true,
        timeZone: "America/Los_Angeles"
    },

    // S: Jun 25 → Jun 27 (covers 25,26)
    {
        id: "shift-2025-06-25-26",
        assigneeId: shannonId,
        start: new Date("2025-06-25T07:00:00-07:00"),
        end: new Date("2025-06-27T07:00:00-07:00"),
        enabled: true,
        timeZone: "America/Los_Angeles"
    },

    // C: Jun 27 → Jun 30 (covers 27,28,29)
    {
        id: "shift-2025-06-27-29",
        assigneeId: janeSmithId,
        start: new Date("2025-06-27T07:00:00-07:00"),
        end: new Date("2025-06-30T07:00:00-07:00"),
        enabled: true,
        timeZone: "America/Los_Angeles"
    },

    // S: Jun 30 → Jul 2 (covers 30, Jul 1)
    {
        id: "shift-2025-06-30-07-01",
        assigneeId: shannonId,
        start: new Date("2025-06-30T07:00:00-07:00"),
        end: new Date("2025-07-02T07:00:00-07:00"),
        enabled: true,
        timeZone: "America/Los_Angeles"
    }
];

testDay("2025-06-01T07:00", testShifts, janeSmithId);
testDay("2025-06-02T06:59", testShifts, janeSmithId);
testDay("2025-06-02T07:00", testShifts, shannonId);
testDay("2025-06-03T06:59", testShifts, shannonId);
testDay("2025-06-03T07:00", testShifts, shannonId);
testDay("2025-06-04T06:59", testShifts, shannonId);
testDay("2025-06-04T07:00", testShifts, shannonId);
testDay("2025-06-05T06:59", testShifts, shannonId);
testDay("2025-06-05T07:00", testShifts, janeSmithId);
testDay("2025-06-06T06:59", testShifts, janeSmithId);
testDay("2025-06-06T07:00", testShifts, janeSmithId);
testDay("2025-06-07T06:59", testShifts, janeSmithId);
testDay("2025-06-07T07:00", testShifts, janeSmithId);
testDay("2025-06-08T06:59", testShifts, janeSmithId);
testDay("2025-06-08T07:00", testShifts, janeSmithId);
testDay("2025-06-09T06:59", testShifts, janeSmithId);
testDay("2025-06-09T07:00", testShifts, shannonId);
testDay("2025-06-10T06:59", testShifts, shannonId);
testDay("2025-06-10T07:00", testShifts, shannonId);
testDay("2025-06-11T06:59", testShifts, shannonId);
testDay("2025-06-11T07:00", testShifts, shannonId);
testDay("2025-06-12T06:59", testShifts, shannonId);
testDay("2025-06-12T07:00", testShifts, janeSmithId);
testDay("2025-06-13T06:59", testShifts, janeSmithId);
testDay("2025-06-13T07:00", testShifts, janeSmithId);
testDay("2025-06-14T06:59", testShifts, janeSmithId);
testDay("2025-06-14T07:00", testShifts, janeSmithId);
testDay("2025-06-15T06:59", testShifts, janeSmithId);
testDay("2025-06-15T07:00", testShifts, janeSmithId);
testDay("2025-06-16T06:59", testShifts, janeSmithId);
testDay("2025-06-16T07:00", testShifts, shannonId);
testDay("2025-06-17T06:59", testShifts, shannonId);
testDay("2025-06-17T07:00", testShifts, shannonId);
testDay("2025-06-18T06:59", testShifts, shannonId);
testDay("2025-06-18T07:00", testShifts, shannonId);
testDay("2025-06-19T06:59", testShifts, shannonId);
testDay("2025-06-19T07:00", testShifts, shannonId);
testDay("2025-06-20T06:59", testShifts, shannonId);
testDay("2025-06-20T07:00", testShifts, shannonId);
testDay("2025-06-21T06:59", testShifts, shannonId);
testDay("2025-06-21T07:00", testShifts, shannonId);
testDay("2025-06-22T06:59", testShifts, shannonId);
testDay("2025-06-22T07:00", testShifts, shannonId);
testDay("2025-06-23T06:59", testShifts, shannonId);
testDay("2025-06-23T07:00", testShifts, janeSmithId);
testDay("2025-06-24T06:59", testShifts, janeSmithId);
testDay("2025-06-24T07:00", testShifts, janeSmithId);
testDay("2025-06-25T06:59", testShifts, janeSmithId);
testDay("2025-06-25T07:00", testShifts, shannonId);
testDay("2025-06-26T06:59", testShifts, shannonId);
testDay("2025-06-26T07:00", testShifts, shannonId);
testDay("2025-06-27T06:59", testShifts, shannonId);
testDay("2025-06-27T07:00", testShifts, janeSmithId);
testDay("2025-06-28T06:59", testShifts, janeSmithId);
testDay("2025-06-28T07:00", testShifts, janeSmithId);
testDay("2025-06-29T06:59", testShifts, janeSmithId);
testDay("2025-06-29T07:00", testShifts, janeSmithId);
testDay("2025-06-30T06:59", testShifts, janeSmithId);
testDay("2025-06-30T07:00", testShifts, shannonId);