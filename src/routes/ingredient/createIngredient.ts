import {Request, Response} from "express";
import {z} from "zod";
import logger from "@root/logger";
import {extractErrorsFromZod} from "@root/utils";
import {AppDataSource} from "@root/data-source";
import Ingredients from "@root/entity/Ingredients";

const IngredientRepository = AppDataSource.getRepository(Ingredients);

const CreatePizzaParams = z.object({
	name: z.string(),
})

/**
 * @swagger
 * /ingredient/create:
 *   post:
 *     tags: [Ingredient]
 *     summary: Create a new ingredient
 *     description: Adds a new ingredient to the database. Returns the created ingredient object.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the ingredient to be created.
 *     responses:
 *       200:
 *         description: Ingredient successfully created.
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
 *         description: Bad request due to validation errors or if the ingredient already exists.
 *       500:
 *         description: Internal server error.
 */


export default async function createIngredient(req: Request, res: Response) {
	const parsed = CreatePizzaParams.safeParse(req.body);
	let isIngredientExist;

	if (parsed.error) {
		logger.warn(parsed.error);
		res.BadRequest(extractErrorsFromZod(parsed.error));
		return;
	}

	const ingredientData = parsed.data;

	try {
		isIngredientExist = await IngredientRepository.exists({
			where: {name: ingredientData.name},
		})
	} catch (e) {
		return res.InternalServerError(e);
	}

	if (isIngredientExist) return res.BadRequest([{message: `Ingredient ${ingredientData.name} already exist`}]);

	const createdIngredient = new Ingredients();

	createdIngredient.name = ingredientData.name;

	try {
		await IngredientRepository.save(createdIngredient)
	} catch (e) {
		return res.InternalServerError(e);
	}

	res.Ok(createdIngredient);
}