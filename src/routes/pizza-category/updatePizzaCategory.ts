import {Request, Response} from "express";
import logger from "@root/logger";
import {extractErrorsFromZod} from "@root/utils";
import {z} from "zod";
import {AppDataSource} from "@root/data-source";
import PizzaCategories from "@root/entity/PizzaCategories";

const PizzaCategoryRepository = AppDataSource.getRepository(PizzaCategories);

const UpdatePizzaCategoryParams = z.object({
    id: z.union([z.string().regex(/^\d+$/), z.number()]).transform(Number),
    name: z.string(),
})

export default function updatePizzaCategory(req: Request, res: Response) {
    const _body = req.body;

    const parsed = UpdatePizzaCategoryParams.safeParse(_body);

    if (parsed.error) {
        logger.warn(parsed.error);
        res.BadRequest(extractErrorsFromZod(parsed.error));
        return;
    }

    const pizzaCategory = parsed.data;

    PizzaCategoryRepository.findOne({
        where: {
            id: pizzaCategory.id
        }
    })
        .then(existedIngredient => {
            if (!existedIngredient) {
                res.NotFound({});
                return;
            }

            existedIngredient.name = pizzaCategory.name;

            PizzaCategoryRepository.save(existedIngredient)
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