import {Request, Response} from 'express';
import {z} from "zod";
import {AppDataSource} from "@root/data-source";
import PizzaCrust from "@root/entity/PizzaCrust";
import logger from "@root/logger";
import {extractErrorsFromZod} from "@root/utils";
import Pizza from "@root/entity/Pizza";

const PizzaCrustSchema = z.object({
    crust: z.string(),
    image: z.string(),
})

const PizzaCrustRepository = AppDataSource.getRepository(PizzaCrust);
const PizzaRepository = AppDataSource.getRepository(Pizza);

export default async function createPizzaCrust(req: Request, res: Response) {
    const pizzaId = req.body.pizzaId;
    const body = req.body;

    try {
        const parsedPizzaId = z.union([z.string().regex(/^\d+$/), z.number()]).transform(Number).safeParse(pizzaId);
        const parsedBody = PizzaCrustSchema.safeParse(body);

        if(parsedBody.error)
        {
            logger.warn(parsedBody.error);
            res.BadRequest(parsedBody.error);
            return;
        }

        const pizzaCrustBody = parsedBody.data;

        if (parsedPizzaId.error)
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

        if(!existedPizza)
        {
            res.NotFound("Pizza not found");
            return;
        }

        const createPizzaCrust = new PizzaCrust();

        createPizzaCrust.pizza = existedPizza;
        createPizzaCrust.crust = pizzaCrustBody.crust;
        createPizzaCrust.image = pizzaCrustBody.image;

        await PizzaCrustRepository.save(createPizzaCrust);

        res.Ok(createPizzaCrust);
    } catch (err) {
        logger.error(err);
        res.InternalServerError({});
    }
}