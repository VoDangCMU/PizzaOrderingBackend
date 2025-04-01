import {Request, Response} from "express";
import logger from "@root/logger";
import {extractErrorsFromZod} from "@root/utils";
import {z} from "zod";
import {AppDataSource} from "@root/data-source";
import Ingredients from "@root/entity/Ingredients";
import Number from "@root/schemas/Number";

const IngredientRepository = AppDataSource.getRepository(Ingredients);

const UpdatePizzaParams = z.object({
	id: Number,
	name: z.string(),
})

/**
 * @swagger
 * /ingredients/update/:
 *   put:
 *     tags: [Ingredient]
 *     summary: Update an ingredient by ID
 *     description: Updates the details of an ingredient specified by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the ingredient to update.
 *         schema:
 *           type: integer
 *       - in: body
 *         name: ingredient
 *         required: true
 *         description: The ingredient object containing updated details.
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *     responses:
 *       200:
 *         description: Ingredient successfully updated.
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
 *         description: Ingredient not found.
 *       500:
 *         description: Internal server error.
 */


export default async function updateIngredient(req: Request, res: Response) {
	const parsedIngredient = UpdatePizzaParams.safeParse(req.body);
	let ingredient;

	if (parsedIngredient.error) {
		logger.warn(parsedIngredient.error);
		return res.BadRequest(extractErrorsFromZod(parsedIngredient.error));
	}

	const ingredientData = parsedIngredient.data;

	try {
		ingredient = await IngredientRepository.findOne({
			where: {
				id: ingredientData.id
			}
		})
	} catch (e) {
		return res.InternalServerError(e);
	}

	if (!ingredient) return res.NotFound([{message: `Ingredient with id ${ingredientData.id} not found`}]);
	ingredient.name = ingredientData.name;

	try {
		await IngredientRepository.save(ingredient)
	} catch (e) {
		return res.InternalServerError(e);
	}

	return res.Ok(ingredient);
}