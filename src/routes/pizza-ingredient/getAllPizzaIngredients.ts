import {Request, Response} from 'express';
import {AppDataSource} from "@root/data-source";
import PizzaIngredient from "@root/entity/PizzaIngredient";
import logger from "@root/logger";

const PizzaIngredientRepository = AppDataSource.getRepository(PizzaIngredient);

export default async function getAllPizzaIngredients(req: Request, res: Response) {
	try {
		const pizzaIngredients = await PizzaIngredientRepository.find({
			relations: {pizza: true, ingredient: true}
		});

		res.Ok(pizzaIngredients);
	} catch (error) {
		logger.error(error);
		res.InternalServerError({});
	}
}