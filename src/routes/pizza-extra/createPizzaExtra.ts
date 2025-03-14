import {Request, Response} from "express";
import {z} from "zod";
import {AppDataSource} from "@root/data-source";
import PizzaExtras from "@root/entity/PizzaExtras";
import logger from "@root/logger";
import {extractErrorsFromZod} from "@root/utils";
import Pizza from "@root/entity/Pizza";

const PizzaExtraSchema = z.object({
    size: z.string(),
    extra: z.string(),
    price: z.union([z.string().regex(/^\d+$/), z.number()]).transform(Number),
    image: z.string(),
})

const PizzaExtraRepository = AppDataSource.getRepository(PizzaExtras);
const PizzaRepository = AppDataSource.getRepository(Pizza);

export default async function createPizzaExtra(req: Request, res: Response) {
    const pizzaId = req.body.pizzaId;
    const body = req.body;

    try {
        const parsedBody = PizzaExtraSchema.safeParse(body);
        const parsedPizzaId = z.union([z.string().regex(/^\d+$/), z.number()]).transform(Number).safeParse(pizzaId);

        if(parsedBody.error)
        {
            logger.warn(parsedBody.error);
            res.BadRequest(parsedBody.error);
            return;
        }

        if(parsedPizzaId.error)
        {
            logger.warn(parsedPizzaId.error);
            res.BadRequest(extractErrorsFromZod(parsedPizzaId.error));
            return;
        }

        const existedPizza = await PizzaRepository.findOne({
            where: {
                id: parsedPizzaId.data,
            }
        })

        if(!existedPizza) {
            res.NotFound("Pizza not found");
            return;
        }

        const createPizzaExtra = new PizzaExtras();

        createPizzaExtra.pizza = existedPizza;
        createPizzaExtra.size = parsedBody.data.size;
        createPizzaExtra.price = parsedBody.data.price;
        createPizzaExtra.image = parsedBody.data.image;
        createPizzaExtra.extra = parsedBody.data.extra;

        await PizzaExtraRepository.save(createPizzaExtra);

        res.Ok(createPizzaExtra);
    }
    catch (err) {
        logger.error(err);
        res.InternalServerError({});
    }
}