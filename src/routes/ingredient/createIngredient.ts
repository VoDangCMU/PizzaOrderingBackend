import {Request, Response} from "express";
import {z} from "zod";
import logger from "@root/logger";
import {extractErrorsFromZod} from "@root/utils";
import {AppDataSource} from "@root/data-source";
import {Ingredients} from "@root/entity/Ingredients";

const IngredientRepository = AppDataSource.getRepository(Ingredients);

const CreatePizzaParams = z.object({
    name: z.string(),
})

export default function createIngredient(req: Request, res: Response) {
    const _body = req.body;

    const parsed = CreatePizzaParams.safeParse(_body);

    if (parsed.error) {
        logger.warn(parsed.error);
        res.BadRequest(extractErrorsFromZod(parsed.error));
        return;
    }

    const ingredient = parsed.data;

    IngredientRepository.exists({
        where: {name: ingredient.name},
    })
        .then(existence => {
            if (existence) {
                return res.BadRequest([{message: "Ingredient already exists"}]);
            }

            const createdIngredient = new Ingredients();

            createdIngredient.name = ingredient.name;

            IngredientRepository.save(createdIngredient)
                .then(() => res.Ok(createdIngredient))
                .catch(err => {
                    logger.error(err);
                    res.InternalServerError({});
                });
        })
        .catch(err => {
            logger.error(err);
            res.InternalServerError({});
        })
}