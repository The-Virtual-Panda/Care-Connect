import * as dotenv from "dotenv";
dotenv.config({ path: "./.env.prod" });

import { FirestoreService } from "../src/services/firestore-service";
import { DateTime } from "luxon";
import { matchShiftRule } from "../src/services/scheduling-service";

// ! Constants for insertion - DANGER
const phoneNumberId = "13605154505";
const carolynId = "VD6DLW1nHy24SbP3jpIq";
const shannonId = "AbWToC83tKVZm9ycSVrb";

function translateAssigneeId(id: string): string {
    switch (id) {
        case carolynId:
            return "Carolyn";
        case shannonId:
            return "Shannon";
        default:
            return "Unknown";
    }
}

// Check a live rule
async function checkLiveRule(dateString: string, dateToCheck: Date) {
    const firestore = new FirestoreService();

    const shifts = await firestore.getShiftsForPhoneNumber(phoneNumberId);
    if (!shifts) {
        console.warn("No shifts found for the given phone number.");
        return;
    }

    const matchedShift = matchShiftRule(dateToCheck, shifts);

    if (matchedShift) {
        const assigneeName = translateAssigneeId(matchedShift.assigneeId);
        console.log(`Matched shift for ${dateString}: Assignee ID = ${assigneeName}`);
    } else {
        console.log(`No shift matched for ${dateString}`);
    }
}

// // PST time to check and convert it
// const pstTime = "2025-06-02T08:00";
// const checkDate = DateTime.fromISO(pstTime, { zone: "America/Los_Angeles" }).toUTC().toJSDate();

// checkLiveRule(checkDate).catch(err => {
//     console.error("Error checking live rule:", err);
// });

async function checkJuneLiveRules() {
    const zone = "America/Los_Angeles";
    const times = ["06:59", "07:00"];
    for (let day = 1; day <= 30; day++) {
        const dateStr = `2025-06-${day.toString().padStart(2, "0")}`;
        for (const time of times) {
            const pstTime = `${dateStr}T${time}`;
            const checkDate = DateTime.fromISO(pstTime, { zone }).toUTC().toJSDate();
            console.log(`\nChecking for ${pstTime} PST:`);
            await checkLiveRule(pstTime, checkDate);
        }
        console.log("\n-----------------------------");
    }
}

checkJuneLiveRules().catch(err => {
    console.error("Error checking June live rules:", err);
});