import {Request, Response} from "express";
import {z} from "zod";
import {extractErrorsFromZod} from "@root/utils";
import logger from "@root/logger";
import {AppDataSource} from "@root/data-source";
import OrderItem from "@root/entity/OrderItem";
import Pizza from "@root/entity/Pizza";
import Order from "@root/entity/Order";
import PizzaCrust from "@root/entity/PizzaCrust";
import PizzaExtras from "@root/entity/PizzaExtras";
import PizzaSize from "@root/entity/PizzaSize";
import PizzaOuterCrust from "@root/entity/PizzaOuterCrust";
import NUMBER from "@root/schemas/Number";

const orderItemRepository = AppDataSource.getRepository(OrderItem);
const PizzaRepository = AppDataSource.getRepository(Pizza);
const PizzaCrustRepository = AppDataSource.getRepository(PizzaCrust);
const PizzaExtraRepository = AppDataSource.getRepository(PizzaExtras);
const PizzaSizeRepository = AppDataSource.getRepository(PizzaSize);
const PizzaOuterCrustRepository = AppDataSource.getRepository(PizzaOuterCrust);
const OrderRepository = AppDataSource.getRepository(Order);

const CreateCartItemSchema = z.object({
	pizzaID: NUMBER,
	pizzaCrustID: NUMBER.nullable().optional(),
	pizzaOuterCrustID: NUMBER.nullable().optional(),
	pizzaExtraID: NUMBER.nullable().optional(),
	pizzaSizeID: NUMBER,
	orderID: NUMBER,
	quantity: NUMBER,
	note: z.string().optional(),
})

export default async function addItemToOrder(req: Request, res: Response) {
	let orderItemData, existedPizza = null, existedPizzaExtra = null, existedPizzaCrust = null,
		existedPizzaOuterCrust = null, existedPizzaSize = null,
		existedOrder = null, existedOrderItem = null;

	try {
		orderItemData = CreateCartItemSchema.parse(req.body);
	} catch (error) {
		logger.warn(error);
		return res.BadRequest(extractErrorsFromZod(error));
	}

	try {
		existedPizza = await PizzaRepository.findOne({
			where: {id: orderItemData.pizzaID},
		})

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

		existedOrder = await OrderRepository.findOne({
			where: {id: orderItemData.orderID},
			relations: {
				orderItems: true,
				user: true
			}
		})

		existedOrderItem = await orderItemRepository.findOne({
			where: {
				pizza: {id: orderItemData.pizzaID},
				crust: orderItemData.pizzaCrustID ? {id: orderItemData.pizzaCrustID} : undefined,
				outerCrust: orderItemData.pizzaOuterCrustID? {id: orderItemData.pizzaOuterCrustID} : undefined,
				extra: orderItemData.pizzaExtraID ? {id: orderItemData.pizzaExtraID} : undefined,
				size: {id: orderItemData.pizzaSizeID},
				order: {id: orderItemData.orderID}
			},
			relations: {
				pizza: true, crust: true, outerCrust: true, extra: true, size: true, order: {orderItems: true}
			}
		});
	} catch (e) {
		return res.InternalServerError(e);
	}

	if (!existedPizza) return res.NotFound([{message: `Pizza with id ${orderItemData.pizzaID} not found.`}])
	if (!existedOrder) return res.NotFound([{message: `Order with id ${orderItemData.orderID} not found.`}]);
	if (!existedPizzaSize) return res.NotFound([{message: `Pizza size with id ${orderItemData.pizzaSizeID} not found.`}]);
	if (existedOrder.user.id != req.userID) return res.Forbidden([{message: `You cannot access others order.`}])

	if (existedOrderItem) {
		existedOrderItem.quantity += orderItemData.quantity;
		await orderItemRepository.save(existedOrderItem);

		return res.Ok(existedOrderItem);
	}

	const createdCartItem = new OrderItem();

	Object.assign(createdCartItem, orderItemData);
	createdCartItem.size = existedPizzaSize;
	createdCartItem.extra = existedPizzaExtra;
	createdCartItem.crust = existedPizzaCrust;
	createdCartItem.outerCrust = existedPizzaOuterCrust;
	createdCartItem.order = existedOrder;
	createdCartItem.pizza = existedPizza;

	await orderItemRepository.save(createdCartItem);

	res.Ok(createdCartItem);
}