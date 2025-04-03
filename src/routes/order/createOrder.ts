import {Request, Response} from "express";
import {AppDataSource} from "@root/data-source";
import Users from "@root/entity/Users";
import Order from "@root/entity/Order";

const UserRepository = AppDataSource.getRepository(Users);
const orderRepository = AppDataSource.getRepository(Order);

export default async function createOrder(req: Request, res: Response) {
  const userID = req.userID;

  try {
    const existedUser = await UserRepository.findOne({
      where: {id: userID},
    })

    if (!existedUser) {
      res.BadRequest([{message: `User with id ${userID} not found`}]);
      return;
    }

    const createdOrder = new Order();

    createdOrder.user = existedUser;
    createdOrder.orderItems = [];

    await orderRepository.save(createdOrder);

    res.Ok(createdOrder);
  } catch (e) {
    res.InternalServerError(e);
    return;
  }
}