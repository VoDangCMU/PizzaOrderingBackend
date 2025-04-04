import {Request, Response} from "express";
import {AppDataSource} from "@root/data-source";
import Users from "@root/entity/Users";
import Order from "@root/entity/Order";

const UserRepository = AppDataSource.getRepository(Users);
const OrderRepository = AppDataSource.getRepository(Order);

export default async function createOrder(req: Request, res: Response) {
	const userID = req.userID;

	try {
		const existedUser = await UserRepository.findOne({
			where: {id: userID},
		})

		if (!existedUser) return res.BadRequest([{message: `User with id ${userID} not found`}]);

		const createdOrder = new Order();

		createdOrder.user = existedUser;
		createdOrder.orderItems = [];

		await OrderRepository.save(createdOrder);

		res.Ok(createdOrder);
	} catch (e) {
		res.InternalServerError(e);
		return;
	}
}