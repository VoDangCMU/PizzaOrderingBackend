import {ZodError} from "zod";
import logger from "@root/logger";

export function extractErrorsFromZod(error: unknown) {
    if (error instanceof ZodError) {
        const messages = error.issues.map(e => {
            return {message: e.message, path: e.path}
        });

        return messages;
    }

    logger.error(error);
    return {message: "Unexpected error occurred. Check server logs for more information."};
}


export function randomUUID() {
    return crypto.randomUUID();
}

export function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}