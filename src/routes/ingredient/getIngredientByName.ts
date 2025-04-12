import {Request, Response} from "express";
import {z} from "zod";
import {AppDataSource} from "@root/data-source";
import Ingredients from "@root/entity/Ingredients";
import logger from "@root/logger";

const IngredientRepository = AppDataSource.getRepository(Ingredients);

const IngredientNameSchema = z.object({
	name: z.string(),
})

/**
 * @swagger
 * /ingredient/get-by-name/{name}:
 *   get:
 *     tags: [Ingredient]
 *     summary: Retrieve a specific ingredient by name
 *     description: Fetches a single ingredient from the database specified by its name.
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         description: The name of the ingredient to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ingredient successfully retrieved.
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


export default async function getIngredientByName(req: Request, res: Response) {
	const name = req.params.name;
	const parsedIngredientName = IngredientNameSchema.safeParse({name});
	let ingredient;

	if (parsedIngredientName.error) {
		logger.warn(parsedIngredientName.error);
		return res.BadRequest(parsedIngredientName.error);
	}

	const ingredientName = parsedIngredientName.data.name;

	try {
		ingredient = await IngredientRepository.findOne({
			where: {
				name: ingredientName
			}
		})
	} catch (e) {
		return res.InternalServerError(e);
	}

	if (!ingredient) return res.NotFound([{message: `Ingredient with name ${ingredientName} not found`}]);

	res.Ok(ingredient);
}
