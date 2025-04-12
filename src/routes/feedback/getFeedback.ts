import { Request, Response } from "express";
import { z } from "zod";
import logger from "@root/logger";
import { extractErrorsFromZod } from "@root/utils";
import { AppDataSource } from "@root/data-source";
import Feedback from "@root/entity/Feedback";
import NUMBER from "@root/schemas/Number";

const FeedbackRepository = AppDataSource.getRepository(Feedback);

const FeedbackIdSchema = z.object({
    id: NUMBER,
});

export default async function getFeedback(req: Request, res: Response) {
    const parsed = FeedbackIdSchema.safeParse({ id: req.params.id });
    if (parsed.error) {
        logger.warn(parsed.error);
        return res.BadRequest(extractErrorsFromZod(parsed.error));
    }

    const feedbackId = parsed.data.id;

    let feedback;

    try {
        feedback = await FeedbackRepository.findOne({
            where: {
                id: feedbackId
            }
        });
    } catch (e) {
        return res.InternalServerError(e);
    }

    if (!feedback) {
        return res.NotFound([{ message: `Feedback with id ${feedbackId} not found` }]);
    }

    return res.Ok(feedback);
}