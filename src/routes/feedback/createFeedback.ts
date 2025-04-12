import { Request, Response } from "express";
import { z } from "zod";
import logger from "@root/logger";
import { extractErrorsFromZod } from "@root/utils";
import { AppDataSource } from "@root/data-source";
import Feedback from "@root/entity/Feedback";
import Pizza from "@root/entity/Pizza";
import Invoice from "@root/entity/Invoice";
import NUMBER from "@root/schemas/Number";

const FeedbackRepository = AppDataSource.getRepository(Feedback);
const PizzaRepository = AppDataSource.getRepository(Pizza);
const InvoiceRepository = AppDataSource.getRepository(Invoice);

const CreateFeedbackParams = z.object({
    pizzaId: NUMBER,
    invoiceId: NUMBER,
    feedback: z.string(),
});

export default async function createFeedback(req: Request, res: Response) {
    const parsed = CreateFeedbackParams.safeParse(req.body);
    if (parsed.error) {
        logger.warn(parsed.error);
        return res.BadRequest(extractErrorsFromZod(parsed.error));
    }

    const pizzaId = parsed.data.pizzaId;
    const invoiceId = parsed.data.invoiceId;
    const feedback = parsed.data.feedback;

    let pizza;
    let invoice;
    let existedFeedback;

    try {
        pizza = await PizzaRepository.findOne({
            where: {
                id: pizzaId
            }
        })
    } catch (e) {
        return res.InternalServerError(e);
    }

    if (!pizza) {
        return res.BadRequest([{message: `Pizza with ID ${pizzaId} not found`}]);
    }

    try {
        invoice = await InvoiceRepository.findOne({
            where: {
                id: invoiceId
            }
        })
    } catch (e) {
        return res.InternalServerError(e);
    }

    if (!invoice) {
        return res.BadRequest([{message: `Invoice with ID ${invoiceId} not found`}]);
    }

    try {
        existedFeedback = await FeedbackRepository.findOne({
            where: {
                pizza: {id: pizzaId},
                invoice: {id: invoiceId}
            }
        });
    } catch (e) {
        return res.InternalServerError(e);
    }

    if (existedFeedback) {
        return res.BadRequest([{message: `Feedback for Pizza ID ${pizzaId} and Invoice ID ${invoiceId} already exists.`}]);
    }

    const createFeedback = new Feedback();
    createFeedback.pizza = pizza;
    createFeedback.invoice = invoice;
    createFeedback.feedback = feedback;

    try {
        await FeedbackRepository.save(createFeedback);
    } catch (e) {
        return res.InternalServerError(e);
    }

    return res.Ok(createFeedback);
}
