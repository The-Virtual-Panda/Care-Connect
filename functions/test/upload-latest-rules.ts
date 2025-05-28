// Load environment variables from .env file
import * as dotenv from "dotenv";
dotenv.config({ path: "./.env.prod" });

import { Shift } from "../src/models/domain/shift";
import { FirestoreService } from "../src/services/firestore-service";

// ! Constants for insertion - DANGER
const phoneNumberId = "13605154505";
const carolynId = "VD6DLW1nHy24SbP3jpIq";
const shannonId = "AbWToC83tKVZm9ycSVrb";

const latestShifts: Shift[] = [
    // C: Jun 1 → Jun 2
    {
        id: "shift-2025-06-01",
        assigneeId: carolynId,
        start: new Date("2025-05-30T07:00:00-07:00"),
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
        assigneeId: carolynId,
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
        assigneeId: carolynId,
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
        assigneeId: carolynId,
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
        assigneeId: carolynId,
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

async function uploadShifts() {
    const firestoreService = new FirestoreService();
    const results: string[] = [];

    for (const shift of latestShifts) {
        if (shift.assigneeId === carolynId) {
            shift.assigneeId = carolynId;
        } else if (shift.assigneeId === shannonId) {
            shift.assigneeId = shannonId;
        }

        const id = await firestoreService.addShiftToPhoneNumber(phoneNumberId, shift);
        results.push(id);
    }

    console.log("Shift IDs uploaded:", results.join(", "));
}

uploadShifts().catch(console.error);