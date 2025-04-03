import {Request, Response} from 'express';
import {AppDataSource} from "@root/data-source";
import Order from "@root/entity/Order";
import logger from "@root/logger";

const orderRepository = AppDataSource.getRepository(Order);

export default async function getAllOrder(req: Request, res: Response) {
  try {
    const carts = await orderRepository.find({
      relations: {user: true, orderItems: {pizza: true, crust: true, outerCrust: true, extra: true, size: true}}
    });

    res.Ok(carts);
  } catch (error) {
    logger.error(error);
    res.InternalServerError({});
  }
}