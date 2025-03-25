import {Request, Response} from 'express';
import {AppDataSource} from "@root/data-source";
import {z} from "zod";
import PizzaIngredient from "@root/entity/PizzaIngredient";
import Ingredients from "@root/entity/Ingredients";
import Pizza from "@root/entity/Pizza";
import {extractErrorsFromZod} from "@root/utils";
import logger from "@root/logger";

const PizzaIngredientRepository = AppDataSource.getRepository(PizzaIngredient);
const IngredientRepository = AppDataSource.getRepository(Ingredients);
const PizzaRepository = AppDataSource.getRepository(Pizza);

export default async function createIngredient(req: Request, res: Response) {
    const ingredientId = req.body.ingredientId;
    const pizzaId = req.body.pizzaId;
    let parsedIngredientId;
    let parsedPizzaId;

    try {
        parsedIngredientId = z.union([z.string().regex(/^\d+$/), z.number()]).transform(Number).safeParse(ingredientId);
        parsedPizzaId = z.union([z.string().regex(/^\d+$/), z.number()]).transform(Number).safeParse(pizzaId);

        if (parsedIngredientId.error) {
            res.BadRequest(extractErrorsFromZod(parsedIngredientId.error));
            return;
        }

        if (parsedPizzaId.error) {
            res.BadRequest(extractErrorsFromZod(parsedPizzaId.error));
            return;
        }

        const existedIngredient = await IngredientRepository.findOne({
            where: {
                id: parsedIngredientId.data,
            }
        })
        if (!existedIngredient) {
            res.NotFound("Ingredient not found");
            return;
        }

        const existedPizza = await PizzaRepository.findOne({
            where: {
                id: parsedPizzaId.data,
            }
        })
        if (!existedPizza) {
            res.NotFound("Pizza not found");
            return;
        }

        const existedPizzaIngredient = await PizzaIngredientRepository.findOne({
            where: {
                pizza: { id: parsedPizzaId.data },
                ingredient: { id: parsedIngredientId.data }
            }
        });

        if (existedPizzaIngredient) {
            res.BadRequest([{message: "PizzaIngredient already exists", detail: existedPizzaIngredient}]);
            return;
        }

        const createdPizzaIngredient = new PizzaIngredient();

        createdPizzaIngredient.ingredient = existedIngredient;
        createdPizzaIngredient.pizza = existedPizza;

        await PizzaIngredientRepository.save(createdPizzaIngredient);

        res.Ok(createdPizzaIngredient);
    } catch (error) {
        logger.error(error);
        res.InternalServerError({});
    }
}
