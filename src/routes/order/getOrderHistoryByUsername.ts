import {Request, Response} from "express";
import {z} from "zod";
import logger from "@root/logger";
import {extractErrorsFromZod} from "@root/utils";
import {AppDataSource} from "@root/data-source";
import Order from "@root/entity/Order";

const OrderRepository = AppDataSource.getRepository(Order);

const UsernameSchema = z.object({
  username: z.string(),
})

export default async function getOrderHistoryByUsername(req: Request, res: Response) {
  let username;
  try {
    username = UsernameSchema.parse({username: req.params.username}).username;
  } catch (error) {
    logger.warn(error);
    return res.BadRequest(extractErrorsFromZod(error))
  }

  try {
    const orders = await OrderRepository.find({
      where: {
        user: {username: username}
      },
      relations: {user: true, orderItems: {pizza: true, crust: true, outerCrust: true, extra: true, size: true}}
    })

    return res.Ok(orders);
  } catch (e) {
    res.InternalServerError(e);
  }
}