import {Request, Response} from 'express'
import {z} from "zod";
import {AppDataSource} from "@root/data-source";
import PizzaImages from "@root/entity/PizzaImages";
import Pizza from "@root/entity/Pizza";
import logger from "@root/logger";

const PizzaImageSchema = z.object({
    src: z.string(),
    alt: z.string(),
})

const PizzaRepository = AppDataSource.getRepository(Pizza);
const PizzaImageRepository = AppDataSource.getRepository(PizzaImages);

export default async function createPizzaImage(req: Request, res: Response) {
    const body = req.body;
    const pizzaId = req.body.pizzaId;

    try {
        const parsedBody = PizzaImageSchema.safeParse(body);
        const parsedPizzaId = z.union([z.string().regex(/^\d+$/), z.number()]).transform(Number).safeParse(pizzaId);

        if (parsedBody.error) {
            res.BadRequest(parsedBody.error);
            return;
        }
        const pizzaImage = parsedBody.data;

        if(parsedPizzaId.error) {
            res.BadRequest(parsedPizzaId.error);
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

        const createdPizzaImage = new PizzaImages();

        createdPizzaImage.pizza = existedPizza;
        createdPizzaImage.src = pizzaImage.src;
        createdPizzaImage.alt = pizzaImage.alt;

        await PizzaImageRepository.save(createdPizzaImage);

        res.Ok(createdPizzaImage);
    }
    catch (err) {
        logger.error(err);
        res.InternalServerError({});
    }
}