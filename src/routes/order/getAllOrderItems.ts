import {Request, Response} from 'express';
import {AppDataSource} from "@root/data-source";
import OrderItem from "@root/entity/OrderItem";
import logger from "@root/logger";

const OrderItemRepository = AppDataSource.getRepository(OrderItem);

export default async function getAllOrderItems(req: Request, res: Response) {
  try {
    const cartItems = await OrderItemRepository.find({
      relations: {pizza: true, order: true, crust: true, extra: true, outerCrust: true, size: true}
    });

    res.Ok(cartItems);
  } catch (error) {
    logger.error(error);
    res.InternalServerError({});
  }
}
