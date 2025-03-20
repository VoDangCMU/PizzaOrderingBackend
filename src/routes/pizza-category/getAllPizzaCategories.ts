import {Request, Response} from 'express';
import {AppDataSource} from "@root/data-source";
import PizzaCategories from "@root/entity/PizzaCategories";
import logger from "@root/logger";

const PizzaCategoryRepository = AppDataSource.getRepository(PizzaCategories);

export default async function getAllPizzaCategories(req: Request, res: Response) {
    try{
        const pizzaCategories = await PizzaCategoryRepository.find();

        res.Ok(pizzaCategories);
    } catch(error) {
        logger.error(error);
        res.InternalServerError({});
    }
}