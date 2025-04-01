import {Request, Response} from "express";
import logger from "@root/logger";
import {extractErrorsFromZod} from "@root/utils";
import {z} from "zod";
import {AppDataSource} from "@root/data-source";
import PizzaCategories from "@root/entity/PizzaCategories";
import Number from "@root/schemas/Number";

const PizzaCategoryRepository = AppDataSource.getRepository(PizzaCategories);

const UpdatePizzaCategoryParams = z.object({
	id: Number,
	name: z.string(),
})

export default async function updatePizzaCategory(req: Request, res: Response) {
	const parsed = UpdatePizzaCategoryParams.safeParse(req.body);
	let category;

	if (parsed.error) {
		logger.warn(parsed.error);
		res.BadRequest(extractErrorsFromZod(parsed.error));
		return;
	}

	const pizzaCategoryData = parsed.data;

	try {
		category = await PizzaCategoryRepository.findOne({
			where: {
				id: pizzaCategoryData.id
			}
		})
	} catch (e) {
		return res.InternalServerError(e);
	}

	if (!category) return res.NotFound([{message: `Category with id ${pizzaCategoryData.id} not found.`}]);

	category.name = pizzaCategoryData.name;

	await PizzaCategoryRepository.save(category)

	return res.Ok(category);
}