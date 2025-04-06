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

/**
 * @swagger
 * /pizza-category/create:
 *   post:
 *     tags: [Pizza-Categories]
 *     summary: Create a new pizza category
 *     description: Adds a new pizza category to the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the pizza category.
 *               description:
 *                 type: string
 *                 description: A brief description of the pizza category.
 *     responses:
 *       200:
 *         description: Pizza category successfully created.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *       400:
 *         description: Bad request due to validation errors or if the category already exists.
 *       500:
 *         description: Internal server error.
 */


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