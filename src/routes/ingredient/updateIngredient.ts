import {Request, Response} from "express";
import logger from "@root/logger";
import {extractErrorsFromZod} from "@root/utils";
import {z} from "zod";
import {AppDataSource} from "@root/data-source";
import Ingredients from "@root/entity/Ingredients";
import Number from "@root/schemas/Number";

const IngredientRepository = AppDataSource.getRepository(Ingredients);

const UpdatePizzaParams = z.object({
	id: Number,
	name: z.string(),
})

export default async function updateIngredient(req: Request, res: Response) {
	const parsedIngredient = UpdatePizzaParams.safeParse(req.body);
	let ingredient;

	if (parsedIngredient.error) {
		logger.warn(parsedIngredient.error);
		return res.BadRequest(extractErrorsFromZod(parsedIngredient.error));
	}

	const ingredientData = parsedIngredient.data;

	try {
		ingredient = await IngredientRepository.findOne({
			where: {
				id: ingredientData.id
			}
		})
	} catch (e) {
		return res.InternalServerError(e);
	}

	if (!ingredient) return res.NotFound([{message: `Ingredient with id ${ingredientData.id} not found`}]);
	ingredient.name = ingredientData.name;

	try {
		await IngredientRepository.save(ingredient)
	} catch (e) {
		return res.InternalServerError(e);
	}

	return res.Ok(ingredient);
}