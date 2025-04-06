import {Request, Response} from "express";
import {z} from "zod";
import logger from "@root/logger";
import {extractErrorsFromZod} from "@root/utils";
import {AppDataSource} from "@root/data-source";
import Ingredients from "@root/entity/Ingredients";
import NUMBER from "@root/schemas/Number";

const IngredientRepository = AppDataSource.getRepository(Ingredients);

const IngredientIdSchema = z.object({
	id: NUMBER
})

/**
 * @swagger
 * /ingredient/delete/{id}:
 *   delete:
 *     tags: [Ingredient]
 *     summary: Delete an ingredient by ID
 *     description: Removes an ingredient from the database specified by its ID. Returns the deleted ingredient object.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the ingredient to delete.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Ingredient successfully deleted.
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


export default async function deleteIngredient(req: Request, res: Response) {
	const parsed = IngredientIdSchema.safeParse({id: req.params.id});
	let ingredient;

	if (parsed.error) {
		logger.warn(`Error: ${parsed.error.message}`);
		res.BadRequest(extractErrorsFromZod(parsed.error));
		return;
	}

	const id = parsed.data.id

	try {
		ingredient = await IngredientRepository.findOne({
			where: {
				id: id
			}
		})
	} catch (e) {
		return res.InternalServerError(e);
	}

	if (!ingredient) return res.NotFound([{message: `Ingredient wit id ${id} not found`}]);

	try {
		await IngredientRepository.delete(id);
	} catch (e) {
		return res.InternalServerError(e);
	}

	res.Ok(ingredient);
}