import {Request, Response} from "express";
import {z} from "zod";
import logger from "@root/logger";
import {extractErrorsFromZod} from "@root/utils";
import PizzaCategories from "@root/entity/PizzaCategories";
import {AppDataSource} from "@root/data-source";

const PizzaCategoryRepository = AppDataSource.getRepository(PizzaCategories);

export default function getPizzaCategory(req: Request, res: Response) {
    const _id = req.params.id;

    const parsed = z.string().regex(/^\d+$/).transform(Number).safeParse(_id);

    if (parsed.error) {
        logger.warn(`Error: ${parsed.error.message}`);
        res.BadRequest(extractErrorsFromZod(parsed.error));
        return;
    }

    const id = parsed.data

    PizzaCategoryRepository.findOne({
        where: {id}
    })
        .then(pizzaCategory => {
            if (!pizzaCategory) {
                res.NotFound({});
                return;
            }

            res.Ok(pizzaCategory);
        })
        .catch(err => {
            logger.error(err);
            res.InternalServerError({});
        })
}