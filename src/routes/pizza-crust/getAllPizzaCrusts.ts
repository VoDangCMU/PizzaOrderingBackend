import { Request, Response } from "express";
import {AppDataSource} from "@root/data-source";
import PizzaCrust from "@root/entity/PizzaCrust";
import logger from "@root/logger";

const PizzaCrustRepository = AppDataSource.getRepository(PizzaCrust);

export default async function getAllPizzaCrusts(req: Request, res: Response) {
    try {
        const pizzaCrusts = await PizzaCrustRepository.find({});

        res.Ok(pizzaCrusts);
    } catch(error) {
        logger.error(error);
        res.InternalServerError({});
    }
}