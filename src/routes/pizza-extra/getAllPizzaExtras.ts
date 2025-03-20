import { Request, Response } from "express";
import {AppDataSource} from "@root/data-source";
import logger from "@root/logger";
import PizzaExtras from "@root/entity/PizzaExtras";

const PizzaExtraRepository = AppDataSource.getRepository(PizzaExtras);

export default async function getAllPizzaExtras(req: Request, res: Response) {
    try {
        const pizzaExtras = await PizzaExtraRepository.find({});

        res.Ok(pizzaExtras);
    } catch(error) {
        logger.error(error);
        res.InternalServerError({});
    }
}