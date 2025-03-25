import {Request, Response} from "express";
import {extractErrorsFromZod} from "@root/utils";
import logger from "@root/logger";
import {z} from "zod";
import {AppDataSource} from "@root/data-source";
import Pizza from "@root/entity/Pizza";

const PizzaRepository = AppDataSource.getRepository(Pizza);

export default async function deletePizza(req: Request, res: Response) {
    const _id = req.params.id;
    let parsed;

    try {
        parsed = z.string().regex(/^\d+$/).transform(Number).parse(_id);
    } catch (e) {
        logger.error(e);
        res.BadRequest(extractErrorsFromZod(e));
        return;
    }

    try {
        const id = parsed!;

        const existedPizza = await PizzaRepository.findOne({
            where: {id},
        })

        if (!existedPizza) {
            res.NotFound([{message: `Pizza with ${id} not found.`}])
            return;
        }

        await PizzaRepository.delete(existedPizza);

        res.Ok(existedPizza);
    } catch (e) {
        logger.error(e);
        res.InternalServerError({});
    }
}