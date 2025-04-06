import {Request, Response} from "express";
import {AppDataSource} from "@root/data-source";
import PizzaIngredient from "@root/entity/PizzaIngredient";
import Ingredients from "@root/entity/Ingredients";
import Pizza from "@root/entity/Pizza";
import {z} from "zod";
import {extractErrorsFromZod} from "@root/utils";
import logger from "@root/logger";
import Number from "@root/schemas/Number";

const UpdatePizzaIngredientSchema = z.object({
	id: Number,
	pizzaId: Number,
	ingredientId: Number
})

const PizzaIngredientRepository = AppDataSource.getRepository(PizzaIngredient);
const IngredientRepository = AppDataSource.getRepository(Ingredients);
const PizzaRepository = AppDataSource.getRepository(Pizza);

export default async function updatePizzaIngredient(req: Request, res: Response) {
	let pizzaIngredientData, existedPizza, existedIngredient, existedPizzaIngredient;

	try {
		pizzaIngredientData = UpdatePizzaIngredientSchema.parse(req.body);
	} catch (e) {
		logger.warn(e);
		return res.BadRequest(extractErrorsFromZod(e));
	}

	try {
		existedPizzaIngredient = await PizzaIngredientRepository.findOne({
			where: {id: pizzaIngredientData.id}
		})

		existedIngredient = await IngredientRepository.findOne({
			where: {id: pizzaIngredientData.ingredientId}
		});

		existedPizza = await PizzaRepository.findOne({
			where: {id: pizzaIngredientData.pizzaId}
		});
	} catch (e) {
		return res.InternalServerError(e);
	}

	if (!existedIngredient) return res.BadRequest([{message: `Ingredient with id ${pizzaIngredientData.ingredientId} not found.`}]);
	if (!existedPizza) return res.BadRequest([{message: `Pizza with id ${pizzaIngredientData.pizzaId} not found.`}]);
	if (!existedPizzaIngredient) return res.BadRequest([{message: `Pizza ingredient with id ${pizzaIngredientData.id} not found.`}]);

	existedPizzaIngredient.ingredient = existedIngredient;
	existedPizzaIngredient.pizza = existedPizza;

	try {
		await PizzaIngredientRepository.save(existedPizzaIngredient);
	} catch (e) {
		return res.InternalServerError(e);
	}

	res.Ok(existedPizzaIngredient);
}