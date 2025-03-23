import {Request, Response} from 'express';
import {z} from "zod";
import {AppDataSource} from "@root/data-source";
import Pizza from "@root/entity/Pizza";
import logger from "@root/logger";

const PizzaSchema = z.object({
    name: z.string(),
})

const PizzaRepository = AppDataSource.getRepository(Pizza);

export default function getPizzaByName(req: Request, res: Response) {
    const name = req.query.name;
    const parsed = PizzaSchema.safeParse({name});

    if(parsed.error)
    {
        logger.warn(parsed.error);
        res.BadRequest(parsed.error);
        return;
    }
    const pizza = parsed.data;

    PizzaRepository.findOne({
        where: {
            name: pizza.name,
        }
    })
        .then(pizza =>{
            if(!pizza)
            {
                res.NotFound([{message: "Pizza Not Found"}]);
                return;
            }

            res.Ok(pizza);
        })
        .catch(err => {
            logger.error(err);
            res.InternalServerError({});
        })
}