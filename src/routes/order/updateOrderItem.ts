import {Request, Response} from "express";
import {z} from "zod";
import logger from "@root/logger";
import {extractErrorsFromZod} from "@root/utils";
import {AppDataSource} from "@root/data-source";
import OrderItem from "@root/entity/OrderItem";
import PizzaCrust from "@root/entity/PizzaCrust";
import PizzaExtras from "@root/entity/PizzaExtras";
import PizzaSize from "@root/entity/PizzaSize";
import PizzaOuterCrust from "@root/entity/PizzaOuterCrust";
import NUMBER from "@root/schemas/Number";

const OrderItemRepository = AppDataSource.getRepository(OrderItem);
const PizzaCrustRepository = AppDataSource.getRepository(PizzaCrust)
const PizzaExtraRepository = AppDataSource.getRepository(PizzaExtras)
const PizzaSizeRepository = AppDataSource.getRepository(PizzaSize)
const PizzaOuterCrustRepository = AppDataSource.getRepository(PizzaOuterCrust)

const UpdateOrderItemSchema = z.object({
	id: NUMBER,
	pizzaCrustID: NUMBER.nullable().optional(),
	pizzaOuterCrustID: NUMBER.nullable().optional(),
	pizzaExtraID: NUMBER.nullable().optional(),
	pizzaSizeID: NUMBER,
	quantity: NUMBER,
	note: z.string().optional(),
})

export default async function updateOrderItem(req: Request, res: Response) {
	let orderItemData, existedPizzaExtra = null, existedPizzaCrust = null,
		existedPizzaOuterCrust = null, existedPizzaSize = null, existedOrderItem = null;

	try {
		orderItemData = UpdateOrderItemSchema.parse(req.body);
	} catch (error) {
		logger.warn(error);
		return res.BadRequest(extractErrorsFromZod(error))
	}

	try {
		existedOrderItem = await OrderItemRepository.findOne({
			where: {id: orderItemData.id},
			relations: {
				pizza: true, crust: true, outerCrust: true, extra: true, size: true, order: {orderItems: true}
			}
		});

		if (orderItemData.pizzaExtraID) existedPizzaExtra = await PizzaExtraRepository.findOne({
			where: {id: orderItemData.pizzaExtraID}
		})

		if (orderItemData.pizzaCrustID) existedPizzaCrust = await PizzaCrustRepository.findOne({
			where: {id: orderItemData.pizzaCrustID}
		})

		if (orderItemData.pizzaOuterCrustID) existedPizzaOuterCrust = await PizzaOuterCrustRepository.findOne({
			where: {id: orderItemData.pizzaOuterCrustID}
		})

		existedPizzaSize = await PizzaSizeRepository.findOne({
			where: {id: orderItemData.pizzaSizeID}
		})

		if (!existedOrderItem) return res.NotFound([{message: `Order item with id ${orderItemData.id} not found.`}])

		Object.assign(existedOrderItem, existedOrderItem);
		existedOrderItem.size = existedPizzaSize;
		existedOrderItem.extra = existedPizzaExtra;
		existedOrderItem.crust = existedPizzaCrust;
		existedOrderItem.outerCrust = existedPizzaOuterCrust;

		await OrderItemRepository.save(existedOrderItem);

		return res.Ok(existedOrderItem);
	} catch (error) {
		logger.error(error);
		return res.InternalServerError({});
	}
}