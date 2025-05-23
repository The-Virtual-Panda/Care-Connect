import { onRequest } from "firebase-functions/https";

// Only expose this function in local development
const isLocal = process.env.NODE_ENV === "dev";

export function localOnRequest(fn: Parameters<typeof onRequest>[0]) {
    return isLocal ? onRequest(fn) : undefined;
}