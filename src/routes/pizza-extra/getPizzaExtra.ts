import {Request, Response} from "express";
import {z} from "zod";
import {AppDataSource} from "@root/data-source";
import PizzaExtras from "@root/entity/PizzaExtras";
import logger from "@root/logger";

const PizzaExtraSchema = z.object({
    id: z.union([z.string().regex(/^\d+$/), z.number()]).transform(Number)
})

const PizzaExtraRepository = AppDataSource.getRepository(PizzaExtras)

export default function getPizzaExtra(req: Request, res: Response) {
    const pizzaExtraId = req.params.id;
    const parsedId = PizzaExtraSchema.safeParse({id: pizzaExtraId});

    if(parsedId.error)
    {
        logger.warn(parsedId.error);
        res.BadRequest(parsedId.error);
        return;
    }

    const pizzaExtraIdParsed = parsedId.data.id;

    PizzaExtraRepository.findOne({
        where: {
            id: pizzaExtraIdParsed
        }
    })
        .then(pizzaExtra => {
            if (!pizzaExtra) {
                res.NotFound("PizzaExtra not found");
                return;
            }

            res.Ok(pizzaExtra);
        })
        .catch(err => {
            logger.error(err);
            res.InternalServerError({});
        })
}