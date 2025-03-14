import { Request, Response } from 'express'
import {z} from "zod";
import {AppDataSource} from "@root/data-source";
import PizzaImages from "@root/entity/PizzaImages";
import logger from "@root/logger";

const GetPizzaImageSchema = z.object({
    id: z.union([z.string().regex(/^\d+$/), z.number()]).transform(Number)
})

const PizzaImageRepository = AppDataSource.getRepository(PizzaImages);

export default function getPizzaImage(req: Request, res: Response) {
    const pizzaImageId = req.params.id;
    const parsedId = GetPizzaImageSchema.safeParse({id: pizzaImageId});

    if(parsedId.error)
    {
        res.BadRequest(parsedId.error);
        return;
    }
    const pizzaImageIdParsed = parsedId.data.id;

    PizzaImageRepository.findOne({
        where: {
            id: pizzaImageIdParsed
        }
    })
        .then(pizzaImage => {
            if (!pizzaImage) {
                res.NotFound("PizzaImage not found");
                return;
            }
            res.Ok(pizzaImage);
        })
        .catch(err => {
            logger.error(err);
            res.InternalServerError({});
        })
}