import {Request, Response} from 'express';
import {AppDataSource} from "@root/data-source";
import Ingredients from "@root/entity/Ingredients";
import logger from "@root/logger";

const IngredientRepository = AppDataSource.getRepository(Ingredients);

/**
 * @swagger
 * /ingredient/get-all:
 *   get:
 *     tags: [Ingredient]
 *     summary: Retrieve all ingredients
 *     description: Fetches a list of all ingredients from the database.
 *     responses:
 *       200:
 *         description: A list of ingredients.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *       500:
 *         description: Internal server error.
 */

export default async function getAllIngredients(req: Request, res: Response) {
	try {
		const ingredients = await IngredientRepository.find();

		res.Ok(ingredients);
	} catch (error) {
		logger.error(error);
		res.InternalServerError({});
	}
}