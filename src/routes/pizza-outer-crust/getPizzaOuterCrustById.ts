import {Request, Response} from "express";
import {z} from "zod";
import {AppDataSource} from "@root/data-source";
import logger from "@root/logger";
import PizzaOuterCrust from "@root/entity/PizzaOuterCrust";

const PizzaOuterCrustSchema = z.object({
    id: z.union([z.string().regex(/^\d+$/), z.number()]).transform(Number)
})

const PizzaOuterCrustRepository = AppDataSource.getRepository(PizzaOuterCrust)

export default function getPizzaOuterCrustById(req: Request, res: Response) {
    const pizzaExtraId = req.params.id;
    const parsedId = PizzaOuterCrustSchema.safeParse({id: pizzaExtraId});

    if(parsedId.error)
    {
        logger.warn(parsedId.error);
        res.BadRequest(parsedId.error);
        return;
    }

    const pizzaOuterCrustIdParsed = parsedId.data.id;

    PizzaOuterCrustRepository.findOne({
        where: {
            id: pizzaOuterCrustIdParsed
        }
    })
        .then(pizzaOuterCrust => {
            if (!pizzaOuterCrust) {
                res.NotFound("PizzaOuterCrust not found");
                return;
            }

            res.Ok(pizzaOuterCrust);
        })
        .catch(err => {
            logger.error(err);
            res.InternalServerError({});
        })
}