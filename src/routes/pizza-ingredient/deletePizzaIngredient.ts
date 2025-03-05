import { Request, Response } from "express";
import {z} from "zod";
import {AppDataSource} from "@root/data-source";
import PizzaIngredient from "@root/entity/PizzaIngredient";
import logger from "@root/logger";

const DeletePizzaIngredientSchema = z.object({
    id: z.union([z.string().regex(/^\d+$/), z.number()]).transform(Number),
})

const PizzaIngredientRepository = AppDataSource.getRepository(PizzaIngredient);

export default function deletePizzaIngredient(req: Request, res: Response) {
    const pizzaIngredientId = req.params.id;

    const parsedId = DeletePizzaIngredientSchema.safeParse({id: pizzaIngredientId});
    if (parsedId.error) {
        res.BadRequest(parsedId.error);
        return;
    }

    const pizzaIngredientIdParsed = parsedId.data.id;
    PizzaIngredientRepository.findOne({
        where: {
            id: pizzaIngredientIdParsed
        }
    })
        .then(pizzaIngredient => {
            if (!pizzaIngredient) {
                res.NotFound("PizzaIngredient not found");
                return;
            }

            PizzaIngredientRepository.delete(pizzaIngredientIdParsed)
                .then(() =>{
                    res.Ok(pizzaIngredient);
                })
                .catch(err => {
                    logger.error(err);
                    res.InternalServerError({});
                })
        })
        .catch(err => {
            logger.error(err);
            res.InternalServerError({});
        })
}