import { Request, Response } from "express";
import {z} from "zod";
import {AppDataSource} from "@root/data-source";
import PizzaImages from "@root/entity/PizzaImages";
import logger from "@root/logger";

const DeletePizzaImageSchema = z.object({
    id: z.union([z.string().regex(/^\d+$/), z.number()]).transform(Number)
})

const PizzaImageRepository = AppDataSource.getRepository(PizzaImages);

export default function deletePizzaImage(req: Request, res: Response) {
    const pizzaImageId = req.params.id;
    const parsedId = DeletePizzaImageSchema.safeParse({id: pizzaImageId});

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

            PizzaImageRepository.delete(pizzaImageIdParsed)
                .then(()=>{
                    res.Ok(pizzaImage);
                })
                .catch(err=>{
                    logger.error(err);
                    res.InternalServerError({});
                })
        })
        .catch(err=>{
            logger.error(err);
            res.InternalServerError({});
        })
}