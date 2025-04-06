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

/**
 * @swagger
 * /pizza-category/update:
 *   put:
 *     tags: [Pizza-Categories]
 *     summary: Update a pizza category by ID
 *     description: Updates the details of a specific pizza category identified by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the pizza category to update.
 *         schema:
 *           type: integer
 *       - in: body
 *         name: body
 *         required: true
 *         description: The data to update the pizza category.
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *     responses:
 *       200:
 *         description: Successfully updated the pizza category.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *       400:
 *         description: Bad request due to validation errors.
 *       404:
 *         description: Pizza category not found.
 *       500:
 *         description: Internal server error.
 */


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