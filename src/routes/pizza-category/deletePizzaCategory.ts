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

/**
 * @swagger
 * /pizza-category/delete/{id}:
 *   delete:
 *     tags:
 *       - Pizza-Categories
 *     summary: Delete a pizza category by ID
 *     description: Removes a pizza category from the database specified by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the pizza category to delete.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pizza category successfully deleted.
 *       400:
 *         description: Bad request due to validation errors.
 *       404:
 *         description: Pizza category not found.
 *       500:
 *         description: Internal server error.
 */


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