import {Request, Response} from "express";
import logger from "@root/logger";
import {extractErrorsFromZod} from "@root/utils";
import {z} from "zod";
import {AppDataSource} from "@root/data-source";
import {Ingredients} from "@root/entity/Ingredients";

const IngredientRepository = AppDataSource.getRepository(Ingredients);

const UpdatePizzaParams = z.object({
    id: z.union([z.string().regex(/^\d+$/), z.number()]).transform(Number),
    name: z.string(),
})

export default function updateIngredient (req: Request, res: Response) {
    const _body = req.body;

    const parsed = UpdatePizzaParams.safeParse(_body);

    if (parsed.error) {
        logger.warn(parsed.error);
        res.BadRequest(extractErrorsFromZod(parsed.error));
        return;
    }

    const ingredient = parsed.data;

    IngredientRepository.findOne({
        where: {
            id: ingredient.id
        }
    })
        .then(existedIngredient => {
            if (!existedIngredient) {
                res.NotFound({});
                return;
            }

            existedIngredient.name = ingredient.name;

            IngredientRepository.save(existedIngredient)
                .then(() => res.Ok(existedIngredient))
                .catch(err => {
                    logger.error(err)
                    res.InternalServerError({});
                });
        })
        .catch(err => {
            logger.error(err);
            res.InternalServerError({});
        })
}