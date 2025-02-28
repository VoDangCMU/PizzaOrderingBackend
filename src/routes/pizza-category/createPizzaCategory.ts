import {Request, Response} from "express";
import {z} from "zod";
import logger from "@root/logger";
import {extractErrorsFromZod} from "@root/utils";
import {AppDataSource} from "@root/data-source";
import PizzaCategories from "@root/entity/PizzaCategories";

const PizzaCategoryRepository = AppDataSource.getRepository(PizzaCategories);

const CreatePizzaCategorySchema = z.object({
    name: z.string(),
})

export function createPizzaCategory(req: Request, res: Response) {
    const _body = req.body;
    const parsed = CreatePizzaCategorySchema.safeParse(_body);

    if (parsed.error) {
        logger.warn(`Error: ${parsed.error.message}`);
        res.BadRequest(extractErrorsFromZod(parsed.error));
        return;
    }

    const category = parsed.data;

    PizzaCategoryRepository.findOne({
        where: {name: category.name.toLowerCase()},
    })
        .then(existedCategory => {
            if (existedCategory) {
                return res.BadRequest([{message: "Category already exists", detail: existedCategory}]);
            }

            const createdCategory = new PizzaCategories();

            createdCategory.name = category.name.toLowerCase();

            PizzaCategoryRepository.save(createdCategory)
                .then(() => res.Ok(createdCategory))
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