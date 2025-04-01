import {Request, Response} from "express";
import {z} from "zod";
import logger from "@root/logger";
import {extractErrorsFromZod} from "@root/utils";
import {AppDataSource} from "@root/data-source";
import PizzaCategories from "@root/entity/PizzaCategories";
import Number from "@root/schemas/Number";

const PizzaCategoryRepository = AppDataSource.getRepository(PizzaCategories);

const PizzaCategoryIdSchema = z.object({
	id: Number
})

export default async function deletePizzaCategory(req: Request, res: Response) {
	const parsed = PizzaCategoryIdSchema.safeParse({id: req.params.id});
	let pizzaCategory;

	if (parsed.error) {
		logger.warn(`Error: ${parsed.error}`);
		res.BadRequest(extractErrorsFromZod(parsed.error));
		return;
	}

	const categoryId = parsed.data.id

	try {
		pizzaCategory = await PizzaCategoryRepository.findOne({
			where: {
				id: categoryId
			}
		})
	} catch (e) {
		return res.InternalServerError(e);
	}

	if (!pizzaCategory) return res.NotFound([{message: `Pizza category with id ${categoryId} not found.`}]);

	try {
		await PizzaCategoryRepository.delete(categoryId);
	} catch (e) {
		return res.InternalServerError(e);
	}

	res.Ok(pizzaCategory)
}