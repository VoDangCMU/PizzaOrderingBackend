import {Request, Response} from "express";
import {z} from "zod";
import logger from "@root/logger";
import {extractErrorsFromZod} from "@root/utils";
import {AppDataSource} from "@root/data-source";
import {Ingredients} from "@root/entity/Ingredients";

const IngredientRepository = AppDataSource.getRepository(Ingredients);

export default function deleteIngredient(req: Request, res: Response) {
    const _id = req.params.id;

    const parsed = z.string().regex(/^\d+$/).transform(Number).safeParse(_id);

    if (parsed.error) {
        logger.warn(`Error: ${parsed.error.message}`);
        res.BadRequest(extractErrorsFromZod(parsed.error));
        return;
    }

    const id = parsed.data

    IngredientRepository.findOne({
        where: {
            id: id
        }
    })
        .then(ingredient => {
            if (!ingredient) {
                res.NotFound({});
                return;
            }

            IngredientRepository.delete(id)
                .then(() => res.Ok(ingredient))
                .catch((err) => {
                    logger.error(err);
                    res.InternalServerError({});
                })
        })
        .catch(err => {
            logger.error(err);
            res.InternalServerError({});
        })
}