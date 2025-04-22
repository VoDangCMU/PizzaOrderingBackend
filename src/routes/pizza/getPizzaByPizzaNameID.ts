import {Request, Response} from 'express';
import {z} from "zod";
import {AppDataSource} from "@root/data-source";
import logger from "@root/logger";
import PizzaSize from "@root/entity/PizzaSize";

const PizzaSchema = z.object({
  pizzaNameID: z.string(),
})

const PizzaSizeRepository = AppDataSource.getRepository(PizzaSize);

export default function getPizzaByPizzaNameID(req: Request, res: Response) {
  const pizzaNameID = req.params.pizzaNameID;
  const parsed = PizzaSchema.safeParse({pizzaNameID});

  if (parsed.error) {
    logger.warn(parsed.error);
    res.BadRequest(parsed.error);
    return;
  }
  const pizza = parsed.data;

  PizzaSizeRepository.findOne({
    where: {
      pizzaNameID: pizza.pizzaNameID
    },
    relations: {pizza: {sizes: true, category: true, extras: true, crusts: true, images: true}}
  })
    .then(pizzaSize => {
      if (!pizzaSize) {
        res.NotFound([{message: `Pizza with name id ${pizza.pizzaNameID} Not Found`}]);
        return;
      }

      res.Ok(pizzaSize.pizza);
    })
    .catch(err => {
      logger.error(err);
      res.InternalServerError({});
    })
}