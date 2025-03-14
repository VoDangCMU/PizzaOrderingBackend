import {Request, Response} from "express";
import {z} from "zod";
import {AppDataSource} from "@root/data-source";
import PizzaExtras from "@root/entity/PizzaExtras";
import logger from "@root/logger";

const DeletePizzaExtraSchema = z.object({
    id: z.union([z.string().regex(/^\d+$/), z.number()]).transform(Number)
})

const PizzaExtraRepository = AppDataSource.getRepository(PizzaExtras);

export default function deletePizzaExtra(req: Request, res: Response) {
    const pizzaExtraId = req.params.id;
    const parsedId = DeletePizzaExtraSchema.safeParse({id: pizzaExtraId});

    if(parsedId.error)
    {
        logger.warn(parsedId.error);
        res.BadRequest(parsedId.error);
        return;
    }

    PizzaExtraRepository.findOne({
        where: {
            id: parsedId.data.id,
        }
    })
        .then(pizzaExtra => {
            if (!pizzaExtra) {
                res.NotFound("PizzaExtra not found");
                return;
            }

            PizzaExtraRepository.delete(parsedId.data.id)
                .then(()=>{
                    res.Ok(pizzaExtra);
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