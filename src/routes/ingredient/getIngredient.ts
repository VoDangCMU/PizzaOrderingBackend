import logger from "@root/logger";
import {extractErrorsFromZod} from "@root/utils";
import {Request, Response} from "express";
import {AppDataSource} from "@root/data-source";
import Ingredients from "@root/entity/Ingredients";
import Number from "@root/schemas/Number";
import {z} from "zod";

const IngredientRepository = AppDataSource.getRepository(Ingredients);

const IngredientIdSchema = z.object({
	id: Number,
})

export default async function getIngredient(req: Request, res: Response) {
	const parsedId = IngredientIdSchema.safeParse({id: req.params.id});
	let ingredient;

	if (parsedId.error) {
		logger.warn(parsedId.error);
		return res.BadRequest(extractErrorsFromZod(parsedId.error));
	}

	const id = parsedId.data.id

	try {
		ingredient = await IngredientRepository.findOne({
			where: {id}
		});
	} catch (err) {
		return res.InternalServerError(err);
	}

	if (!ingredient) return res.NotFound([{message: `Ingredient with id ${id} not found.`}]);

	return res.Ok(ingredient);
}