import {Request, Response} from "express";
import {z} from "zod";
import logger from "@root/logger";
import {AppDataSource} from "@root/data-source";
import PizzaCategories from "@root/entity/PizzaCategories";

const PizzaCategorySchema = z.object({
	name: z.string(),
});

const PizzaCategoryRepository = AppDataSource.getRepository(PizzaCategories);

export async function getPizzaCategoryByName(req: Request, res: Response) {
	const name = req.params.name;
	let category;
	const parsed = PizzaCategorySchema.safeParse({name});

	if (parsed.error) {
		logger.warn(parsed.error);
		return res.BadRequest(parsed.error);
	}

	const categoryName = parsed.data.name;

	try {
		category = await PizzaCategoryRepository.findOne({
			where: {
				name: categoryName
			},
		})
	} catch (e) {
		return res.InternalServerError(e);
	}

	if (!category) return res.NotFound([{message: "Pizza Category Not Found"}]);

	res.Ok(category);
}
