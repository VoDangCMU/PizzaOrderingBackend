import {Request, Response} from "express";
import {z} from "zod";
import {AppDataSource} from "@root/data-source";
import logger from "@root/logger";
import Pizza from "@root/entity/Pizza";
import PizzaOuterCrust from "@root/entity/PizzaOuterCrust";

const PizzaOuterCrustSchema = z.object({
    pizzaId: z.union([z.string().regex(/^\d+$/), z.number()]).transform(Number),
    name: z.string(),
    size: z.enum(['S', 'M', 'L', 'XL', 'XXL']),
    price: z.union([z.string().regex(/^\d+$/), z.number()]).transform(Number),
    image: z.string(),
})

const PizzaOuterCrustRepository = AppDataSource.getRepository(PizzaOuterCrust);
const PizzaRepository = AppDataSource.getRepository(Pizza);

export default async function createPizzaOuterCrust(req: Request, res: Response) {
    const body = req.body;

    try {
        const parsedBody = PizzaOuterCrustSchema.safeParse(body);
        if(parsedBody.error)
        {
            logger.warn(parsedBody.error);
            res.BadRequest(parsedBody.error);
            return;
        }

        const existedPizza = await PizzaRepository.findOne({
            where: {
                id: parsedBody.data.pizzaId,
            }
        })

        if(!existedPizza) {
            res.NotFound("Pizza not found");
            return;
        }

        const createPizzaOuterCrust = new PizzaOuterCrust();

        createPizzaOuterCrust.pizza = existedPizza;
        createPizzaOuterCrust.name = parsedBody.data.name;
        createPizzaOuterCrust.size = parsedBody.data.size;
        createPizzaOuterCrust.price = parsedBody.data.price;
        createPizzaOuterCrust.image = parsedBody.data.image;

        await PizzaOuterCrustRepository.save(createPizzaOuterCrust);

        res.Ok(createPizzaOuterCrust);
    }
    catch (err) {
        logger.error(err);
        res.InternalServerError({});
    }
}