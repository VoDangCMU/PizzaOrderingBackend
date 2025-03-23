import { Request, Response } from "express";
import { z } from "zod";
import { AppDataSource } from "@root/data-source";
import Ingredients from "@root/entity/Ingredients";
import logger from "@root/logger";

const IngredientSchema = z.object({
    name: z.string(),
});

const IngredientRepository = AppDataSource.getRepository(Ingredients);

export default function getIngredientByName(req: Request, res: Response) {
    const name = req.query.name;
    const parsed = IngredientSchema.safeParse({ name });

    if (parsed.error) {
        logger.warn(parsed.error);
        res.BadRequest(parsed.error);
        return;
    }

    const ingredient = parsed.data;

    IngredientRepository.findOne({
        where: {
            name: ingredient.name
        }
    })
        .then((ingredient) => {
            if (!ingredient) {
                res.NotFound([{ message: "Ingredient Not Found" }]);
                return;
            }
            res.Ok(ingredient);
        })
        .catch((err) => {
            logger.error(err);
            res.InternalServerError({});
        });
}
