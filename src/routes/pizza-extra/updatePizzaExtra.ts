import {Request, Response} from 'express';
import {z} from "zod";
import {AppDataSource} from "@root/data-source";
import PizzaExtras from "@root/entity/PizzaExtras";
import Pizza from "@root/entity/Pizza";
import logger from "@root/logger";

const UpdatePizzaExtraSchema = z.object({
    size: z.string(),
    extra: z.string(),
    price: z.union([z.string().regex(/^\d+$/), z.number()]).transform(Number),
    image: z.string(),
})

const PizzaExtraRepository = AppDataSource.getRepository(PizzaExtras);
const PizzaRepository = AppDataSource.getRepository(Pizza);

export default async function updatePizzaExtra(req: Request, res: Response) {
    const pizzaExtraId = req.params.id;
    const pizzaId = req.body.pizzaId;
    const pizzaExtraBody = req.body;

    try{
        const parsedPizzaExtraId = z.union([z.string().regex(/^\d+$/), z.number()]).transform(Number).safeParse(pizzaExtraId);
        const parsedPizzaId = z.union([z.string().regex(/^\d+$/), z.number()]).transform(Number).safeParse(pizzaId);
        const parsedBody = UpdatePizzaExtraSchema.safeParse(pizzaExtraBody);

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

        if(parsedPizzaExtraId.error)
        {
            logger.warn(parsedPizzaExtraId.error);
            res.BadRequest(parsedPizzaExtraId.error);
            return;
        }

        const updatePizzaExtra = await PizzaExtraRepository.findOne({
            where: {
                id: parsedPizzaExtraId.data,
            }
        })

        if(!updatePizzaExtra)
        {
            res.NotFound("PizzaExtra not found");
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

        updatePizzaExtra.size = body.size;
        updatePizzaExtra.extra = body.extra;
        updatePizzaExtra.price = body.price;
        updatePizzaExtra.image = body.image;

        await PizzaExtraRepository.save(updatePizzaExtra);

        res.Ok(updatePizzaExtra);
    }
    catch (err) {
        logger.error(err);
        res.InternalServerError({});
    }
}
