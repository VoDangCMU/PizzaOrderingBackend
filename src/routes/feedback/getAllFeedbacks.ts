import {Request, Response} from 'express';
import {AppDataSource} from "@root/data-source";
import logger from "@root/logger";
import Feedback from "@root/entity/Feedback";

const FeedbackRepository = AppDataSource.getRepository(Feedback);

export default async function getAllFeedbacks(req: Request, res: Response) {
    try {
        const feedbacks = await FeedbackRepository.find();

        res.Ok(feedbacks);
    } catch (error) {
        logger.error(error);
        res.InternalServerError({});
    }
}