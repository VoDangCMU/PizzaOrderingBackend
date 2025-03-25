import {Request, Response} from "express";
import {z} from "zod";
import logger from "@root/logger";
import {extractErrorsFromZod} from "@root/utils";
import {AppDataSource} from "@root/data-source";
import CartItem from "@root/entity/CartItem";
import PizzaCrust from "@root/entity/PizzaCrust";
import PizzaExtras from "@root/entity/PizzaExtras";
import PizzaSize from "@root/entity/PizzaSize";
import PizzaOuterCrust from "@root/entity/PizzaOuterCrust";

const CartItemRepository = AppDataSource.getRepository(CartItem);
const PizzaCrustRepository = AppDataSource.getRepository(PizzaCrust)
const PizzaExtraRepository = AppDataSource.getRepository(PizzaExtras)
const PizzaSizeRepository = AppDataSource.getRepository(PizzaSize)
const PizzaOuterCrustRepository = AppDataSource.getRepository(PizzaOuterCrust)

const UpdateCartItemSchema = z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
    quantity: z.string().regex(/^\d+$/).transform(Number),
    pizzaCrustID: z.string().regex(/^\d+$/).transform(Number),
    pizzaOuterCrustID: z.string().regex(/^\d+$/).transform(Number),
    pizzaExtraID: z.string().regex(/^\d+$/).transform(Number),
    pizzaSizeID: z.string().regex(/^\d+$/).transform(Number),
    note: z.string().optional(),
})

export default async function updateCartItem(req: Request, res: Response) {
    let newCartItem;
    try {
        newCartItem = UpdateCartItemSchema.parse(req.body);
    } catch (error) {
        logger.warn(error);
        return res.BadRequest(extractErrorsFromZod(error))
    }

    try {
        const existedCartItem = await CartItemRepository.findOne({
            where: {id: newCartItem.id},
            relations: {
                pizza: true,
                cart: {cartItems: true, user: true}
            },
        });

        if (!existedCartItem) {
            return res.NotFound([{message: `Cart with id ${newCartItem.id} not found`}]);
        }

        if (existedCartItem.cart.user.id != req.userID) {
            return res.Forbidden([{message: `You cannot access others cart`}])
        }

        const existedPizzaExtra = await PizzaExtraRepository.findOne({
            where: {id: newCartItem.pizzaExtraID}
        })
        const pizzaExtra = existedPizzaExtra || null;

        const existedPizzaCrust = await PizzaCrustRepository.findOne({
            where: {id: newCartItem.pizzaCrustID}
        })
        const pizzaCrust = existedPizzaCrust || null;

        const existedPizzaOuterCrust = await PizzaOuterCrustRepository.findOne({
            where: {id: newCartItem.pizzaOuterCrustID}
        })
        const pizzaOuterCrust = existedPizzaOuterCrust || null;

        const existedPizzaSize = await PizzaSizeRepository.findOne({
            where: {id: newCartItem.pizzaSizeID}
        })
        const pizzaSize = existedPizzaSize || null;

        existedCartItem.quantity = newCartItem.quantity;
        existedCartItem.crust = pizzaCrust;
        existedCartItem.outerCrust = pizzaOuterCrust;
        existedCartItem.extra = pizzaExtra;
        existedCartItem.size = pizzaSize;
        existedCartItem.note = newCartItem.note || "";

        await CartItemRepository.save(existedCartItem);

        return res.Ok(existedCartItem);
    } catch (error) {
        logger.error(error);
        return res.InternalServerError({});
    }
}