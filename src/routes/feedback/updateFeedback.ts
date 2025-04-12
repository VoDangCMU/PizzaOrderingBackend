import { Request, Response } from "express";
import logger from "@root/logger";
import { extractErrorsFromZod } from "@root/utils";
import { z } from "zod";
import { AppDataSource } from "@root/data-source";
import Feedback from "@root/entity/Feedback";
import Number from "@root/schemas/Number";

const FeedbackRepository = AppDataSource.getRepository(Feedback);

const UpdateFeedbackParams = z.object({
    id: Number,
    feedback: z.string(),
});

export default async function updateFeedback(req: Request, res: Response) {
    const parsedFeedback = UpdateFeedbackParams.safeParse(req.body);
    if (parsedFeedback.error) {
        logger.warn(parsedFeedback.error);
        return res.BadRequest(extractErrorsFromZod(parsedFeedback.error));
    }

    const feedbackData = parsedFeedback.data;

    let feedback;

    try {
        feedback = await FeedbackRepository.findOne({
            where: {
                id: feedbackData.id
            }
        });
    } catch (e) {
        return res.InternalServerError(e);
    }
    if (!feedback) {
        return res.NotFound([{ message: `Feedback with id ${feedbackData.id} not found` }]);
    }

    feedback.feedback = feedbackData.feedback;

    try {
        await FeedbackRepository.save(feedback);
    } catch (e) {
        return res.InternalServerError(e);
    }

    return res.Ok(feedback);
}
