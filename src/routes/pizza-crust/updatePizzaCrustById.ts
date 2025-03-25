import {Request, Response} from 'express';
import {z} from "zod";
import {AppDataSource} from "@root/data-source";
import PizzaCrust from "@root/entity/PizzaCrust";
import Pizza from "@root/entity/Pizza";
import logger from "@root/logger";

const UpdatePizzaCrustSchema = z.object({
    crust: z.string(),
    image: z.string(),
})

const PizzaCrustRepository = AppDataSource.getRepository(PizzaCrust);
const PizzaRepository = AppDataSource.getRepository(Pizza);

export default async function updatePizzaCrustById(req: Request, res: Response) {
    const body = req.body;
    const pizzaCrustId = req.params.id;
    const pizzaId = req.body.pizzaId;

    try {
        const parsedBody = UpdatePizzaCrustSchema.safeParse(body);
        const parsedPizzaCrustId = z.union([z.string().regex(/^\d+$/), z.number()]).transform(Number).safeParse(pizzaCrustId);
        const parsedPizzaId = z.union([z.string().regex(/^\d+$/), z.number()]).transform(Number).safeParse(pizzaId);

        if(parsedBody.error)
        {
            logger.warn(parsedBody.error);
            res.BadRequest(parsedBody.error);
            return;
        }

        const parsedBodyPizzaCrust = parsedBody.data;

        if(parsedPizzaCrustId.error)
        {
            logger.warn(parsedPizzaCrustId.error);
            res.BadRequest(parsedPizzaCrustId.error);
            return;
        }

        if(parsedPizzaId.error)
        {
            logger.warn(parsedPizzaId.error);
            res.BadRequest(parsedPizzaId.error);
            return;
        }

        const updatePizzaCrust = await PizzaCrustRepository.findOne({
            where: {
                id: parsedPizzaCrustId.data
            }
        })

        if(!updatePizzaCrust)
        {
            res.NotFound("PizzaCrust not found");
            return;
        }

        const existedPizza = await PizzaRepository.findOne({
            where: {
                id: parsedPizzaId.data
            }
        })

        if(!existedPizza)
        {
            res.NotFound("Pizza not found");
            return;
        }

        updatePizzaCrust.crust = parsedBodyPizzaCrust.crust;
        updatePizzaCrust.image = parsedBodyPizzaCrust.image;

        await PizzaCrustRepository.save(updatePizzaCrust);

        res.Ok(updatePizzaCrust);
    } catch (err) {
        logger.error(err);
        res.InternalServerError({});
    }
}