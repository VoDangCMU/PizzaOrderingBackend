import { Request, Response } from 'express'
import {AppDataSource} from "@root/data-source";
import Pizza from "@root/entity/Pizza";
import logger from "@root/logger";

const PizzaRepository = AppDataSource.getRepository(Pizza);

export default async function getAllPizzas(req: Request, res: Response) {
    try{
        const pizzas = await PizzaRepository.find();

        res.Ok(pizzas);
    } catch(error){
        logger.error(error);
        res.InternalServerError({});
    }
}