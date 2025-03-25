import {Request, Response} from 'express';
import {AppDataSource} from "@root/data-source";
import PizzaImages from "@root/entity/PizzaImages";
import logger from "@root/logger";

const PizzaImageRepository = AppDataSource.getRepository(PizzaImages);

export default async function getAllPizzaImages(req: Request, res: Response) {
    try {
        const pizzaImages = await PizzaImageRepository.find();

        res.Ok(pizzaImages);
    } catch(error) {
        logger.error(error);
        res.InternalServerError({});
    }
}