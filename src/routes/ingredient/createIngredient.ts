import {Request, Response} from "express";
import {z} from "zod";
import logger from "@root/logger";
import {extractErrorsFromZod} from "@root/utils";
import {AppDataSource} from "@root/data-source";
import Ingredients from "@root/entity/Ingredients";

const IngredientRepository = AppDataSource.getRepository(Ingredients);

const CreatePizzaParams = z.object({
	name: z.string(),
})

export default async function createIngredient(req: Request, res: Response) {
	const parsed = CreatePizzaParams.safeParse(req.body);
	let isIngredientExist;

	if (parsed.error) {
		logger.warn(parsed.error);
		res.BadRequest(extractErrorsFromZod(parsed.error));
		return;
	}

	const ingredientData = parsed.data;

	try {
		isIngredientExist = await IngredientRepository.exists({
			where: {name: ingredientData.name},
		})
	} catch (e) {
		return res.InternalServerError(e);
	}

	if (isIngredientExist) return res.BadRequest([{message: `Ingredient ${ingredientData.name} already exist`}]);

	const createdIngredient = new Ingredients();

	createdIngredient.name = ingredientData.name;

	try {
		await IngredientRepository.save(createdIngredient)
	} catch (e) {
		return res.InternalServerError(e);
	}

	res.Ok(createdIngredient);
}