import {Request, Response} from "express";
import {z} from "zod";
import logger from "@root/logger";
import {AppDataSource} from "@root/data-source";
import PizzaCategories from "@root/entity/PizzaCategories";

const PizzaCategorySchema = z.object({
	name: z.string(),
});

const PizzaCategoryRepository = AppDataSource.getRepository(PizzaCategories);

/**
 * @swagger
 * /pizza-category/get-by-name/{name}:
 *   get:
 *     tags: [Pizza-Categories]
 *     summary: Retrieve a pizza category by name
 *     description: Fetches a specific pizza category from the database using its name.
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         description: The name of the pizza category to retrieve.
 *         schema:
 *           type: string
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
