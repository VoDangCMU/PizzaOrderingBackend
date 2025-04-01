import {Request, Response} from "express";
import {z} from "zod";
import logger from "@root/logger";
import {extractErrorsFromZod} from "@root/utils";
import PizzaCategories from "@root/entity/PizzaCategories";
import {AppDataSource} from "@root/data-source";
import Number from "@root/schemas/Number";

const PizzaCategoryRepository = AppDataSource.getRepository(PizzaCategories);

const PizzaCategoryIdSchema = z.object({
	id: Number
})

export default async function getPizzaCategory(req: Request, res: Response) {
	const parsed = PizzaCategoryIdSchema.safeParse({id: req.params.id});
	let category;

	if (parsed.error) {
		logger.warn(`Error: ${parsed.error}`);
		res.BadRequest(extractErrorsFromZod(parsed.error));
		return;
	}

	const categoryId = parsed.data.id;

	try {
		category = await PizzaCategoryRepository.findOne({
			where: {id: categoryId}
		})
	} catch (e) {
		return res.InternalServerError(e);
	}

	if (!category) return res.NotFound([{message: `Pizza category with id ${categoryId} not found`}])

	res.Ok(category);
}