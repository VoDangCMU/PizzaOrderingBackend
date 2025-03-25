import {Request, Response} from 'express';
import {z} from "zod";
import {AppDataSource} from "@root/data-source";
import PizzaCrust from "@root/entity/PizzaCrust";
import logger from "@root/logger";

const DeletePizzaCrustSchema = z.object({
    id: z.union([z.string().regex(/^\d+$/), z.number()]).transform(Number)
})

const PizzaCrustRepository = AppDataSource.getRepository(PizzaCrust);

export default function deletePizzaCrustById(req: Request, res: Response) {
    const pizzaCrustId = req.params.id;
    const parsedId = DeletePizzaCrustSchema.safeParse({id: pizzaCrustId});

    if(parsedId.error)
    {
        logger.warn(parsedId.error);
        res.BadRequest(parsedId.error);
        return;
    }

    const parsedPizzaCrustId = parsedId.data.id;

    PizzaCrustRepository.findOne({
        where: {
            id: parsedPizzaCrustId
        }
    })
        .then(pizzaCrustCrust => {
            if (!pizzaCrustCrust) {
                res.NotFound("PizzaCrust not found");
                return;
            }
            PizzaCrustRepository.delete(parsedPizzaCrustId)
                .then(() => {
                    res.Ok(pizzaCrustCrust)
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