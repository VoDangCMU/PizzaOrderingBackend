import {z} from "zod";
import {AppDataSource} from "@root/data-source";
import PizzaImages from "@root/entity/PizzaImages";
import Pizza from "@root/entity/Pizza";
import {Request, Response} from "express";
import logger from "@root/logger";
import {extractErrorsFromZod} from "@root/utils";


const UpdatePizzaImageSchema = z.object({
    src: z.string(),
    alt: z.string()
})

const PizzaImageRepository = AppDataSource.getRepository(PizzaImages);
const PizzaRepository = AppDataSource.getRepository(Pizza);

export default async function updatePizzaImage(req: Request, res: Response) {
    const pizzaImageId = req.params.id;
    const body = req.body;
    const pizzaId = req.body.pizzaId;

    try{
        const parsedPizzaImageId = z.union([z.string().regex(/^\d+$/), z.number()]).transform(Number).safeParse(pizzaImageId);
        const parsedBody = UpdatePizzaImageSchema.safeParse(body);
        const parsedPizzaId =  z.union([z.string().regex(/^\d+$/), z.number()]).transform(Number).safeParse(pizzaId);

        if(parsedPizzaImageId.error)
        {
            logger.warn(parsedPizzaImageId.error);
            res.BadRequest(extractErrorsFromZod(parsedPizzaImageId.error));
            return;
        }


        if(parsedPizzaId.error)
        {
            logger.warn(parsedPizzaId.error);
            res.BadRequest(extractErrorsFromZod(parsedPizzaId.error));
            return;
        }


        if(parsedBody.error)
        {
            logger.warn(parsedBody.error);
            res.BadRequest(parsedBody.error);
            return;
        }

        const pizzaImageBody = parsedBody.data;

        const existedPizzaImage = await PizzaImageRepository.findOne({
            where: {
                id: parsedPizzaImageId.data
            }
        })

        if (!existedPizzaImage) {
            res.NotFound("PizzaImage not found");
            return;
        }

        const existedPizza = await PizzaRepository.findOne({
            where: {
                id: parsedPizzaId.data
            }
        })

        if (!existedPizza) {
            res.NotFound("Pizza not found");
            return;
        }

        existedPizzaImage.src = pizzaImageBody.src;
        existedPizzaImage.alt = pizzaImageBody.alt;

        await PizzaImageRepository.save(existedPizzaImage);

        res.Ok(existedPizzaImage);
    }
    catch (err) {
        logger.error(err);
        res.InternalServerError({});
    }
}