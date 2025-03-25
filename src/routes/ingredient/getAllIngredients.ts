import {Request, Response} from 'express';
import {AppDataSource} from "@root/data-source";
import Ingredients from "@root/entity/Ingredients";
import logger from "@root/logger";

const IngredientRepository = AppDataSource.getRepository(Ingredients);

export default async function getAllIngredients(req: Request, res: Response) {
    try{
        const ingredients = await IngredientRepository.find();

        res.Ok(ingredients);
    } catch(error) {
        logger.error(error);
        res.InternalServerError({});
    }
}