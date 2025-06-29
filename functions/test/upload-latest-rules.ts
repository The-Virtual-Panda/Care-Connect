// Load environment variables from .env file
import * as dotenv from "dotenv";
dotenv.config({ path: "./.env.prod" });

import { Shift } from "../src/models/domain/shift";
import { FirestoreService } from "../src/services/firestore-service";

// ! Constants for insertion - DANGER
const phoneNumberId = "13605154505";
const carolynId = "VD6DLW1nHy24SbP3jpIq";
const shannonId = "AbWToC83tKVZm9ycSVrb";

const julyShifts: Shift[] = [
    {
        id: "shift-2025-07-01-to-2025-07-01",
        assigneeId: shannonId,
        start: new Date("2025-07-01T07:00:00-07:00"),
        end: new Date("2025-07-02T07:00:00-07:00"),
        enabled: true,
        timeZone: "America/Los_Angeles"
    },
    {
        id: "shift-2025-07-02-to-2025-07-03",
        assigneeId: carolynId,
        start: new Date("2025-07-02T07:00:00-07:00"),
        end: new Date("2025-07-04T07:00:00-07:00"),
        enabled: true,
        timeZone: "America/Los_Angeles"
    },
    {
        id: "shift-2025-07-04-to-2025-07-06",
        assigneeId: shannonId,
        start: new Date("2025-07-04T07:00:00-07:00"),
        end: new Date("2025-07-07T07:00:00-07:00"),
        enabled: true,
        timeZone: "America/Los_Angeles"
    },
    {
        id: "shift-2025-07-07-to-2025-07-08",
        assigneeId: carolynId,
        start: new Date("2025-07-07T07:00:00-07:00"),
        end: new Date("2025-07-09T07:00:00-07:00"),
        enabled: true,
        timeZone: "America/Los_Angeles"
    },
    {
        id: "shift-2025-07-09-to-2025-07-10",
        assigneeId: shannonId,
        start: new Date("2025-07-09T07:00:00-07:00"),
        end: new Date("2025-07-11T07:00:00-07:00"),
        enabled: true,
        timeZone: "America/Los_Angeles"
    },
    {
        id: "shift-2025-07-11-to-2025-07-13",
        assigneeId: carolynId,
        start: new Date("2025-07-11T07:00:00-07:00"),
        end: new Date("2025-07-14T07:00:00-07:00"),
        enabled: true,
        timeZone: "America/Los_Angeles"
    },
    {
        id: "shift-2025-07-14-to-2025-07-16",
        assigneeId: shannonId,
        start: new Date("2025-07-14T07:00:00-07:00"),
        end: new Date("2025-07-17T07:00:00-07:00"),
        enabled: true,
        timeZone: "America/Los_Angeles"
    },
    {
        id: "shift-2025-07-17-to-2025-07-18",
        assigneeId: carolynId,
        start: new Date("2025-07-17T07:00:00-07:00"),
        end: new Date("2025-07-19T07:00:00-07:00"),
        enabled: true,
        timeZone: "America/Los_Angeles"
    },
    {
        id: "shift-2025-07-19-to-2025-07-21",
        assigneeId: shannonId,
        start: new Date("2025-07-19T07:00:00-07:00"),
        end: new Date("2025-07-22T07:00:00-07:00"),
        enabled: true,
        timeZone: "America/Los_Angeles"
    },
    {
        id: "shift-2025-07-22-to-2025-07-23",
        assigneeId: carolynId,
        start: new Date("2025-07-22T07:00:00-07:00"),
        end: new Date("2025-07-24T07:00:00-07:00"),
        enabled: true,
        timeZone: "America/Los_Angeles"
    },
    {
        id: "shift-2025-07-24-to-2025-07-25",
        assigneeId: shannonId,
        start: new Date("2025-07-24T07:00:00-07:00"),
        end: new Date("2025-07-26T07:00:00-07:00"),
        enabled: true,
        timeZone: "America/Los_Angeles"
    },
    {
        id: "shift-2025-07-26-to-2025-07-28",
        assigneeId: carolynId,
        start: new Date("2025-07-26T07:00:00-07:00"),
        end: new Date("2025-07-29T07:00:00-07:00"),
        enabled: true,
        timeZone: "America/Los_Angeles"
    },
    {
        id: "shift-2025-07-29-to-2025-07-31",
        assigneeId: shannonId,
        start: new Date("2025-07-29T07:00:00-07:00"),
        end: new Date("2025-08-01T07:00:00-07:00"),
        enabled: true,
        timeZone: "America/Los_Angeles"
    }
];


async function uploadShifts() {
    const firestoreService = new FirestoreService();
    const results: string[] = [];

    for (const shift of julyShifts) {
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