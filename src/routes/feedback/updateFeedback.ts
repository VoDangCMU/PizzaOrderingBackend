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
        res.BadRequest(extractErrorsFromZod(parsedFeedback.error));
        return;
    }

    const feedbackData = parsedFeedback.data;

    try {
        const feedback = await FeedbackRepository.findOne({
            where: {
                id: feedbackData.id
            }
        });
        if (!feedback) {
            res.NotFound([{ message: `Feedback with id ${feedbackData.id} not found` }]);
            return;
        }

        feedback.feedback = feedbackData.feedback;

        await FeedbackRepository.save(feedback);

        return res.Ok(feedback);
    } catch (e) {
        logger.error(e);
        res.InternalServerError(e);
        return;
    }
}
