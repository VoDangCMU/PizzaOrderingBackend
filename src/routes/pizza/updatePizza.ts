import {z} from "zod";
import {Request, Response} from "express";
import logger from "@root/logger";
import {extractErrorsFromZod} from "@root/utils";
import {AppDataSource} from "@root/data-source";
import Pizza from "@root/entity/Pizza";
import PizzaCategories from "@root/entity/PizzaCategories";

const PizzaRepository = AppDataSource.getRepository(Pizza);
const PizzaCategoryRepository = AppDataSource.getRepository(PizzaCategories);

const UpdatePizzaSchema = z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
    name: z.string(),
    categoryID: z.string().regex(/^\d+$/).transform(Number),
})

export default async function updatePizza(req: Request, res: Response) {
    let parsed;

    try {
        parsed = UpdatePizzaSchema.parse(req.body);
    } catch (e) {
        logger.warn(e);
        res.BadRequest(extractErrorsFromZod(e));
        return;
    }

    try {
        const pizza = parsed!;

        const existedPizza = await PizzaRepository.findOne({
            where: {id: pizza.id},
        });

        if (!existedPizza) {
            res.NotFound([{message: `Pizza with id ${pizza.id} not found.`}]);
            return;
        }

        const existedCategory = await PizzaCategoryRepository.findOne({
            where: {id: pizza.categoryID},
        })

        if (!existedCategory) {
            res.NotFound([{message: `Category with id ${pizza.categoryID} not found.`}])
            return;
        }

        existedPizza.name = pizza.name;
        existedPizza.category = existedCategory;

        await PizzaRepository.save(existedPizza);

        res.Ok(existedPizza)
    } catch (e) {
        logger.error(e);
        res.InternalServerError({});
    }
}