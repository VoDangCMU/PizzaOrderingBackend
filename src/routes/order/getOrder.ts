import {Request, Response} from "express";
import logger from "@root/logger";
import {extractErrorsFromZod} from "@root/utils";
import {AppDataSource} from "@root/data-source";
import Order from "@root/entity/Order";
import NUMBER from "@root/schemas/Number";

const orderRepository = AppDataSource.getRepository(Order);

export default async function getOrder(req: Request, res: Response) {
  const userID = req.userID;

  let orderID;

  try {
    orderID = NUMBER.parse(req.params.id);
  } catch (e) {
    logger.warn(`Error: ${e}`);
    res.BadRequest(extractErrorsFromZod(e));
    return;
  }

  try {
    const order = await orderRepository.findOne({
      where: {
        id: orderID,
        user: {id: userID},
      },
      relations: {user: true, orderItems: {pizza: true, crust: true, outerCrust: true, extra: true, size: true}}
    })

    if (!order) return res.NotFound([{message: `Order with id ${orderID} not found`}]);

    if (order.user.id != userID) {
      res.Forbidden([{message: `You cannot access others order.`}])
      return;
    }

    res.Ok(order);
  } catch (e) {
    logger.error(`Error: ${e}`);
    res.InternalServerError({});
    return;
  }
}