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

/**
 * @swagger
 * /pizza-category/get-by-id/{id}:
 *   get:
 *     tags: [Pizza-Categories]
 *     summary: Retrieve a pizza category by ID
 *     description: Fetches a specific pizza category from the database using its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the pizza category to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successfully retrieved the pizza category.
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
 *         description: Bad request due to validation errors.
 *       404:
 *         description: Pizza category not found.
 *       500:
 *         description: Internal server error.
 */


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