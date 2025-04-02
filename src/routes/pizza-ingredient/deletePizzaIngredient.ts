import {Request, Response} from "express";
import {z} from "zod";
import {AppDataSource} from "@root/data-source";
import PizzaIngredient from "@root/entity/PizzaIngredient";
import Number from "@root/schemas/Number";

const DeletePizzaIngredientSchema = z.object({
	id: Number,
})

const PizzaIngredientRepository = AppDataSource.getRepository(PizzaIngredient);

export default async function deletePizzaIngredient(req: Request, res: Response) {
	const pizzaIngredientData = DeletePizzaIngredientSchema.safeParse({id: req.params.id});
	let existedPizzaIngredient;

	if (pizzaIngredientData.error) {
		res.BadRequest(pizzaIngredientData.error);
		return;
	}

	const pizzaIngredientId = pizzaIngredientData.data.id;

	try {
		existedPizzaIngredient = await PizzaIngredientRepository.findOne({
			where: {
				id: pizzaIngredientId
			}
		})
	} catch (e) {
		return res.InternalServerError(e);
	}

	if (!existedPizzaIngredient) return res.NotFound([{message: `Pizza Ingredient with id ${pizzaIngredientId} not found.`}]);

	try {
		await PizzaIngredientRepository.delete(pizzaIngredientId)
	} catch (e) {
		return res.InternalServerError(e);
	}

	res.Ok(existedPizzaIngredient);
}