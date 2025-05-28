import { Shift } from "../models/domain/shift";
import { FirestoreService } from "../services/firestore-service";
import { localOnRequest } from "./local-on-request";

const testShifts: Shift[] = [
    // C: Jun 1 → Jun 2
    {
        id: "shift-2025-06-01",
        assigneeId: "Carolyn",
        forwardTo: "Carolyn",
        start: new Date("2025-06-01T07:00:00-07:00"),
        end: new Date("2025-06-02T07:00:00-07:00"),
        enabled: true,
        timeZone: "America/Los_Angeles"
    },

    // S: Jun 2 → Jun 5 (covers 2,3,4)
    {
        id: "shift-2025-06-02-04",
        assigneeId: "Shannon",
        forwardTo: "Shannon",
        start: new Date("2025-06-02T07:00:00-07:00"),
        end: new Date("2025-06-05T07:00:00-07:00"),
        enabled: true,
        timeZone: "America/Los_Angeles"
    },

    // C: Jun 5 → Jun 9 (covers 5,6,7,8)
    {
        id: "shift-2025-06-05-08",
        assigneeId: "Carolyn",
        forwardTo: "Carolyn",
        start: new Date("2025-06-05T07:00:00-07:00"),
        end: new Date("2025-06-09T07:00:00-07:00"),
        enabled: true,
        timeZone: "America/Los_Angeles"
    },

    // S: Jun 9 → Jun 12 (covers 9,10,11)
    {
        id: "shift-2025-06-09-11",
        assigneeId: "Shannon",
        forwardTo: "Shannon",
        start: new Date("2025-06-09T07:00:00-07:00"),
        end: new Date("2025-06-12T07:00:00-07:00"),
        enabled: true,
        timeZone: "America/Los_Angeles"
    },

    // C: Jun 12 → Jun 16 (covers 12,13,14,15)
    {
        id: "shift-2025-06-12-15",
        assigneeId: "Carolyn",
        forwardTo: "Carolyn",
        start: new Date("2025-06-12T07:00:00-07:00"),
        end: new Date("2025-06-16T07:00:00-07:00"),
        enabled: true,
        timeZone: "America/Los_Angeles"
    },

    // S: Jun 16 → Jun 23 (covers 16–22)
    {
        id: "shift-2025-06-16-22",
        assigneeId: "Shannon",
        forwardTo: "Shannon",
        start: new Date("2025-06-16T07:00:00-07:00"),
        end: new Date("2025-06-23T07:00:00-07:00"),
        enabled: true,
        timeZone: "America/Los_Angeles"
    },

    // C: Jun 23 → Jun 25 (covers 23,24)
    {
        id: "shift-2025-06-23-24",
        assigneeId: "Carolyn",
        forwardTo: "Carolyn",
        start: new Date("2025-06-23T07:00:00-07:00"),
        end: new Date("2025-06-25T07:00:00-07:00"),
        enabled: true,
        timeZone: "America/Los_Angeles"
    },

    // S: Jun 25 → Jun 27 (covers 25,26)
    {
        id: "shift-2025-06-25-26",
        assigneeId: "Shannon",
        forwardTo: "Shannon",
        start: new Date("2025-06-25T07:00:00-07:00"),
        end: new Date("2025-06-27T07:00:00-07:00"),
        enabled: true,
        timeZone: "America/Los_Angeles"
    },

    // C: Jun 27 → Jun 30 (covers 27,28,29)
    {
        id: "shift-2025-06-27-29",
        assigneeId: "Carolyn",
        forwardTo: "Carolyn",
        start: new Date("2025-06-27T07:00:00-07:00"),
        end: new Date("2025-06-30T07:00:00-07:00"),
        enabled: true,
        timeZone: "America/Los_Angeles"
    },

    // S: Jun 30 → Jul 2 (covers 30, Jul 1)
    {
        id: "shift-2025-06-30-07-01",
        assigneeId: "Shannon",
        forwardTo: "Shannon",
        start: new Date("2025-06-30T07:00:00-07:00"),
        end: new Date("2025-07-02T07:00:00-07:00"),
        enabled: true,
        timeZone: "America/Los_Angeles"
    }
];

export const testAddShiftsToPhoneNumber = localOnRequest(async (req, res) => {
    const firestoreService = new FirestoreService();
    const phoneNumberId = "13605154505";

    const results: string[] = [];
    for (const shift of testShifts) {
        const id = await firestoreService.addShiftToPhoneNumber(phoneNumberId, shift);
        results.push(id);
    }

    res.json({ insertedShiftIds: results });
});