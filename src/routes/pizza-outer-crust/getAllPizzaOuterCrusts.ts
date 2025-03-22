import { Request, Response } from "express";
import {AppDataSource} from "@root/data-source";
import logger from "@root/logger";
import PizzaOuterCrust from "@root/entity/PizzaOuterCrust";

const PizzaOuterCrustRepository = AppDataSource.getRepository(PizzaOuterCrust);

export default async function getAllPizzaOuterCrusts(req: Request, res: Response) {
    try {
        const pizzaOuterCrusts = await PizzaOuterCrustRepository.find({});

        res.Ok(pizzaOuterCrusts);
    } catch(error) {
        logger.error(error);
        res.InternalServerError({});
    }
}