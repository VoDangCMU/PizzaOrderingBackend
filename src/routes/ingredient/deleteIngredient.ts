import {Request, Response} from "express";
import {z} from "zod";
import logger from "@root/logger";
import {extractErrorsFromZod} from "@root/utils";
import {AppDataSource} from "@root/data-source";
import Ingredients from "@root/entity/Ingredients";
import NUMBER from "@root/schemas/Number";

const IngredientRepository = AppDataSource.getRepository(Ingredients);

const IngredientIdSchema = z.object({
	id: NUMBER
})

export default async function deleteIngredient(req: Request, res: Response) {
	const parsed = IngredientIdSchema.safeParse({id: req.params.id});
	let ingredient;

	if (parsed.error) {
		logger.warn(`Error: ${parsed.error.message}`);
		res.BadRequest(extractErrorsFromZod(parsed.error));
		return;
	}

	const id = parsed.data.id

	try {
		ingredient = await IngredientRepository.findOne({
			where: {
				id: id
			}
		})
	} catch (e) {
		return res.InternalServerError(e);
	}

	if (!ingredient) return res.NotFound([{message: `Ingredient wit id ${id} not found`}]);

	try {
		await IngredientRepository.delete(id);
	} catch (e) {
		return res.InternalServerError(e);
	}

	res.Ok(ingredient);
}