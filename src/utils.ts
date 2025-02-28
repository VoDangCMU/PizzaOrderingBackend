import {ZodError} from "zod";

export function extractErrorsFromZod(error: ZodError) {
    const messages = error.issues.map(e => {
        return {message: e.message, path: e.path}
    });

    return messages;
}