import {Request, Response} from 'express';
import {z} from "zod";
import {AppDataSource} from "@root/data-source";
import Pizza from "@root/entity/Pizza";
import logger from "@root/logger";
import PizzaOuterCrust from "@root/entity/PizzaOuterCrust";

const UpdatePizzaOuterCrustSchema = z.object({
    name: z.string(),
    size: z.string(),
    price: z.union([z.string().regex(/^\d+$/), z.number()]).transform(Number),
    image: z.string(),
})

const PizzaOuterCrustRepository = AppDataSource.getRepository(PizzaOuterCrust);
const PizzaRepository = AppDataSource.getRepository(Pizza);

export default async function updatePizzaOuterCrustById(req: Request, res: Response) {
    const pizzaOuterCrustId = req.params.id;
    const pizzaId = req.body.pizzaId;
    const pizzaOuterCrustBody = req.body;

    try{
        const parsedPizzaOuterCrustId = z.union([z.string().regex(/^\d+$/), z.number()]).transform(Number).safeParse(pizzaOuterCrustId);
        const parsedPizzaId = z.union([z.string().regex(/^\d+$/), z.number()]).transform(Number).safeParse(pizzaId);
        const parsedBody = UpdatePizzaOuterCrustSchema.safeParse(pizzaOuterCrustBody);

        if(parsedBody.error)
        {
            logger.warn(parsedBody.error);
            res.BadRequest(parsedBody.error);
            return;
        }

        const body = parsedBody.data;

        if(parsedPizzaId.error)
        {
            logger.warn(parsedPizzaId.error);
            res.BadRequest(parsedPizzaId.error);
            return;
        }

        if(parsedPizzaOuterCrustId.error)
        {
            logger.warn(parsedPizzaOuterCrustId.error);
            res.BadRequest(parsedPizzaOuterCrustId.error);
            return;
        }

        const updatePizzaOuterCrust = await PizzaOuterCrustRepository.findOne({
            where: {
                id: parsedPizzaOuterCrustId.data,
            }
        })

        if(!updatePizzaOuterCrust)
        {
            res.NotFound("PizzaOuterCrust not found");
            return;
        }

        const existedPizza = await PizzaRepository.findOne({
            where: {
                id: parsedPizzaId.data,
            }
        })

        if (!existedPizza) {
            res.NotFound("Pizza not found");
            return;
        }

        updatePizzaOuterCrust.size = body.size;
        updatePizzaOuterCrust.name = body.name;
        updatePizzaOuterCrust.price = body.price;
        updatePizzaOuterCrust.image = body.image;

        await PizzaOuterCrustRepository.save(updatePizzaOuterCrust);

        res.Ok(updatePizzaOuterCrust);
    }
    catch (err) {
        logger.error(err);
        res.InternalServerError({});
    }
}
