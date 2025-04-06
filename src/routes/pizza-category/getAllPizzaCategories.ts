import {Request, Response} from 'express';
import {AppDataSource} from "@root/data-source";
import PizzaCategories from "@root/entity/PizzaCategories";
import logger from "@root/logger";

const PizzaCategoryRepository = AppDataSource.getRepository(PizzaCategories);

/**
 * @swagger
 * /pizza-category/get-all:
 *   get:
 *     tags: [Pizza-Categories]
 *     summary: Retrieve all pizza categories
 *     description: Fetches a list of all pizza categories from the database.
 *     responses:
 *       200:
 *         description: A list of pizza categories.
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
 *                   description:
 *                     type: string
 *       500:
 *         description: Internal server error.
 */


export default async function getAllPizzaCategories(req: Request, res: Response) {
    try{
        const pizzaCategories = await PizzaCategoryRepository.find();

        res.Ok(pizzaCategories);
    } catch(error) {
        logger.error(error);
        res.InternalServerError(error);
    }
}