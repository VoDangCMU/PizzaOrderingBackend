import {Request, Response} from "express";
import {extractErrorsFromZod} from "@root/utils";
import logger from "@root/logger";
import {AppDataSource} from "@root/data-source";
import OrderItem from "@root/entity/OrderItem";
import Number from "@root/schemas/Number";

const OrderItemRepository = AppDataSource.getRepository(OrderItem);

export default async function removeItemFromOrder(req: Request, res: Response) {
	let orderItemID;
	try {
		orderItemID = Number.parse(req.params.id);
	} catch (error) {
		logger.warn(error);
		return res.BadRequest(extractErrorsFromZod(error));
	}

	try {
		const existedCartItem = await OrderItemRepository.findOne({
			where: {id: orderItemID}
		});

		if (existedCartItem) {
			await OrderItemRepository.delete(existedCartItem.id);

			return res.Ok(existedCartItem);
		}

		return res.NotFound([{message: `Could not find cart item with id ${orderItemID}`}]);
	} catch (e) {
		logger.error(e);
		return res.InternalServerError({});
	}
}