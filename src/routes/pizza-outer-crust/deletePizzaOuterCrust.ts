import {Request, Response} from "express";
import {z} from "zod";
import {AppDataSource} from "@root/data-source";
import logger from "@root/logger";
import PizzaOuterCrust from "@root/entity/PizzaOuterCrust";

const DeletePizzaOuterCrustSchema = z.object({
    id: z.union([z.string().regex(/^\d+$/), z.number()]).transform(Number)
})

const PizzaOuterCrustRepository = AppDataSource.getRepository(PizzaOuterCrust);

export default function deletePizzaOuterCrust(req: Request, res: Response) {
    const pizzaOuterCrustId = req.params.id;
    const parsedId = DeletePizzaOuterCrustSchema.safeParse({id: pizzaOuterCrustId});

    if(parsedId.error)
    {
        logger.warn(parsedId.error);
        res.BadRequest(parsedId.error);
        return;
    }

    PizzaOuterCrustRepository.findOne({
        where: {
            id: parsedId.data.id,
        }
    })
        .then(pizzaOuterCrust => {
            if (!pizzaOuterCrust) {
                res.NotFound("PizzaOuterCrust not found");
                return;
            }

            PizzaOuterCrustRepository.delete(parsedId.data.id)
                .then(()=>{
                    res.Ok(pizzaOuterCrust);
                })
                .catch(err => {
                    logger.error(err);
                    res.InternalServerError({});
                })
        })
        .catch(err => {
            logger.error(err);
            res.InternalServerError({});
        })
}