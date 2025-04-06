import {Request, Response} from "express";
import {AppDataSource} from "@root/data-source";
import PizzaIngredient from "@root/entity/PizzaIngredient";
import {z} from "zod";

const PizzaIngredientSchema = z.object({
	id: z.union([z.string().regex(/^\d+$/), z.number()]).transform(Number)
})

const PizzaIngredientRepository = AppDataSource.getRepository(PizzaIngredient);

export default async function getPizzaIngredient(req: Request, res: Response) {
	const pizzaIngredientData = PizzaIngredientSchema.safeParse({id: req.params.id});
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
			},
			relations: {pizza: true, ingredient: true}
		})
	} catch (e) {
		return res.InternalServerError(e);
	}

	if (!existedPizzaIngredient) return res.NotFound([{message: `Pizza Ingredient with id ${pizzaIngredientId} not found.`}])
	res.Ok(existedPizzaIngredient);
}