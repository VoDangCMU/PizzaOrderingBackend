import {Request, Response} from "express";
import {z} from "zod";
import {AppDataSource} from "@root/data-source";
import Ingredients from "@root/entity/Ingredients";
import logger from "@root/logger";

const IngredientRepository = AppDataSource.getRepository(Ingredients);

const IngredientNameSchema = z.object({
	name: z.string(),
})

export default async function getIngredientByName(req: Request, res: Response) {
	const name = req.params.name;
	const parsedIngredientName = IngredientNameSchema.safeParse({name});
	let ingredient;

	if (parsedIngredientName.error) {
		logger.warn(parsedIngredientName.error);
		return res.BadRequest(parsedIngredientName.error);
	}

	const ingredientName = parsedIngredientName.data.name;

	try {
		ingredient = await IngredientRepository.findOne({
			where: {
				name: ingredientName
			}
		})
	} catch (e) {
		return res.InternalServerError(e);
	}

	if (!ingredient) return res.NotFound([{message: `Ingredient with name ${ingredientName} not found`}]);

	res.Ok(ingredient);
}
