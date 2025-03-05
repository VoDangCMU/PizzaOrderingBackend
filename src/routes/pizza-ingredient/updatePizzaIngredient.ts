import { Request, Response } from "express";
import {AppDataSource} from "@root/data-source";
import PizzaIngredient from "@root/entity/PizzaIngredient";
import Ingredients from "@root/entity/Ingredients";
import Pizza from "@root/entity/Pizza";
import {z} from "zod";
import {extractErrorsFromZod} from "@root/utils";
import logger from "@root/logger";

const UpdatePizzaIngredientSchema = z.object({
    id: z.union([z.string().regex(/^\d+$/), z.number()]).transform(Number),
})

const PizzaIngredientRepository = AppDataSource.getRepository(PizzaIngredient);
const IngredientRepository = AppDataSource.getRepository(Ingredients);
const PizzaRepository = AppDataSource.getRepository(Pizza);

export default async function updatePizzaIngredient(req: Request, res: Response) {
    const pizzaIngredientId = req.params.id;
    const pizzaId = req.body.pizzaId;
    const ingredientId = req.body.ingredientId;
    const parsedPizzaIngredient = UpdatePizzaIngredientSchema.safeParse({id: pizzaIngredientId});
    const parsedIngredientId = z.union([z.string().regex(/^\d+$/), z.number()]).transform(Number).safeParse(ingredientId);
    const parsedPizzaId = z.union([z.string().regex(/^\d+$/), z.number()]).transform(Number).safeParse(pizzaId);

    if(parsedPizzaIngredient.error) {
        res.BadRequest(parsedPizzaIngredient.error);
        return;
    }

    if (parsedIngredientId.error) {
        res.BadRequest(extractErrorsFromZod(parsedIngredientId.error));
        return;
    }

    if (parsedPizzaId.error) {
        res.BadRequest(extractErrorsFromZod(parsedPizzaId.error));
        return;
    }

    const pizzaIngredientIdParsed = parsedPizzaIngredient.data.id;

    try {
        const existedPizzaIngredient = await PizzaIngredientRepository.findOne({
            where: {
                id: pizzaIngredientIdParsed
            }
        })
        if (!existedPizzaIngredient) {
            res.NotFound("PizzaIngredient not found");
            return;
        }

        const existedIngredient = await IngredientRepository.findOne({
            where: {
                id: parsedIngredientId.data
            }
        });
        if (!existedIngredient) {
            res.NotFound("Ingredient not found");
            return;
        }

        const existedPizza = await PizzaRepository.findOne({
            where: {
                id: parsedPizzaId.data
            }
        });
        if (!existedPizza) {
            res.NotFound("Pizza not found");
            return;
        }

        existedPizzaIngredient.ingredient = existedIngredient;
        existedPizzaIngredient.pizza = existedPizza;

        await PizzaIngredientRepository.save(existedPizzaIngredient);
        res.Ok(existedPizzaIngredient);
    }
    catch(err) {
        logger.error(err);
        res.InternalServerError({});
    }
}