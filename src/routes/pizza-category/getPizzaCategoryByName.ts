import { Request, Response } from "express";
import { z } from "zod";
import logger from "@root/logger";
import { AppDataSource } from "@root/data-source";
import PizzaCategories from "@root/entity/PizzaCategories";

const PizzaCategorySchema = z.object({
    name: z.string(),
});

const PizzaCategoryRepository = AppDataSource.getRepository(PizzaCategories);

export function getPizzaCategoryByName(req: Request, res: Response) {
    const name = req.query.name;
    const parsed = PizzaCategorySchema.safeParse({ name });

    if (parsed.error) {
        logger.warn(parsed.error);
        res.BadRequest(parsed.error);
        return;
    }

    const category = parsed.data;

    PizzaCategoryRepository.findOne({
        where: {
            name: category.name
        },
    })
        .then((category) => {
            if (!category) {
                res.NotFound([{ message: "Pizza Category Not Found" }]);
                return;
            }
            res.Ok(category);
        })
        .catch((err) => {
            logger.error(err);
            res.InternalServerError({});
        });
}
