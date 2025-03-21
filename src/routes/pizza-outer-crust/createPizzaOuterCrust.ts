import {Request, Response} from "express";
import {z} from "zod";
import {AppDataSource} from "@root/data-source";
import logger from "@root/logger";
import {extractErrorsFromZod} from "@root/utils";
import Pizza from "@root/entity/Pizza";
import PizzaOuterCrust from "@root/entity/PizzaOuterCrust";

const PizzaOuterCrustSchema = z.object({
    name: z.string(),
    size: z.string(),
    price: z.union([z.string().regex(/^\d+$/), z.number()]).transform(Number),
    image: z.string(),
})

const PizzaOuterCrustRepository = AppDataSource.getRepository(PizzaOuterCrust);
const PizzaRepository = AppDataSource.getRepository(Pizza);

export default async function createPizzaOuterCrust(req: Request, res: Response) {
    const pizzaId = req.body.pizzaId;
    const body = req.body;

    try {
        const parsedBody = PizzaOuterCrustSchema.safeParse(body);
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