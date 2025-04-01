import {Request, Response} from "express";
import {z} from "zod";
import logger from "@root/logger";
import {extractErrorsFromZod} from "@root/utils";
import {AppDataSource} from "@root/data-source";
import PizzaCategories from "@root/entity/PizzaCategories";

const PizzaCategoryRepository = AppDataSource.getRepository(PizzaCategories);

const CreatePizzaCategorySchema = z.object({
	name: z.string(),
	description: z.string(),
})

export async function createPizzaCategory(req: Request, res: Response) {
	const parsed = CreatePizzaCategorySchema.safeParse(req.body);
	let existedCategory;

	if (parsed.error) {
		logger.warn(`Error: ${parsed.error}`);
		res.BadRequest(extractErrorsFromZod(parsed.error));
		return;
	}

	const categoryData = parsed.data;

	try {
		existedCategory = await PizzaCategoryRepository.findOne({
			where: {name: categoryData.name.toLowerCase()},
		})
	} catch (e) {
		return res.InternalServerError(e);
	}

	if (existedCategory) {
		return res.BadRequest([{message: "Category already exists", detail: existedCategory}]);
	}

	const createdCategory = new PizzaCategories();

	createdCategory.name = categoryData.name.toLowerCase();
	createdCategory.description = categoryData.description;

	try {
		await PizzaCategoryRepository.save(createdCategory);
	} catch (e) {
		return res.InternalServerError(e);
	}

	res.Ok(createdCategory)
}