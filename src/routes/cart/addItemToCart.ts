import {Request, Response} from "express";
import {z} from "zod";
import {extractErrorsFromZod} from "@root/utils";
import logger from "@root/logger";
import {AppDataSource} from "@root/data-source";
import CartItem from "@root/entity/CartItem";
import Pizza from "@root/entity/Pizza";
import Cart from "@root/entity/Cart";
import PizzaCrust from "@root/entity/PizzaCrust";
import PizzaExtras from "@root/entity/PizzaExtras";
import PizzaSize from "@root/entity/PizzaSize";
import PizzaOuterCrust from "@root/entity/PizzaOuterCrust";

const CartItemRepository = AppDataSource.getRepository(CartItem);
const PizzaRepository = AppDataSource.getRepository(Pizza);
const PizzaCrustRepository = AppDataSource.getRepository(PizzaCrust);
const PizzaExtraRepository = AppDataSource.getRepository(PizzaExtras);
const PizzaSizeRepository = AppDataSource.getRepository(PizzaSize);
const PizzaOuterCrustRepository = AppDataSource.getRepository(PizzaOuterCrust);
const CartRepository = AppDataSource.getRepository(Cart);

const CreateCartItemSchema = z.object({
    pizzaID: z.string().regex(/^\d+$/).transform(Number),
    pizzaCrustID: z.string().regex(/^\d+$/).transform(Number),
    pizzaOuterCrustID: z.string().regex(/^\d+$/).transform(Number),
    pizzaExtraID: z.string().regex(/^\d+$/).transform(Number),
    pizzaSizeID: z.string().regex(/^\d+$/).transform(Number),
    cartID: z.string().regex(/^\d+$/).transform(Number),
    quantity: z.string().regex(/^\d+$/).transform(Number),
    note: z.string().optional(),
})

export default async function addItemToCart(req: Request, res: Response) {
    let parsed;
    try {
        parsed = CreateCartItemSchema.parse(req.body);
    } catch (error) {
        logger.warn(error);
        return res.BadRequest(extractErrorsFromZod(error));
    }

    try {
        const cartItem = parsed;

        const existedPizza = await PizzaRepository.findOne({
            where: {id: cartItem.pizzaID},
        })

        if (!existedPizza) {
            return res.NotFound([{message: `Pizza with id ${cartItem.pizzaID} not found.`}])
        }

        const existedPizzaExtra = await PizzaExtraRepository.findOne({
            where: {id: cartItem.pizzaExtraID}
        })
        const pizzaExtra = existedPizzaExtra || null;

        const existedPizzaCrust = await PizzaCrustRepository.findOne({
            where: {id: cartItem.pizzaCrustID}
        })
        const pizzaCrust = existedPizzaCrust || null;

        const existedPizzaOuterCrust = await PizzaOuterCrustRepository.findOne({
            where: {id: cartItem.pizzaOuterCrustID}
        })
        const pizzaOuterCrust = existedPizzaOuterCrust || null;

        const existedPizzaSize = await PizzaSizeRepository.findOne({
            where: {id: cartItem.pizzaSizeID}
        })
        const pizzaSize = existedPizzaSize || null;

        const existedCart = await CartRepository.findOne({
            where: {id: cartItem.cartID},
            relations: {
                cartItems: true,
                user: true
            }
        })

        if (!existedCart) {
            return res.NotFound([{message: `Cart with id ${cartItem.cartID} not found.`}])
        }

        if (existedCart.user.id != req.userID) {
            return res.Forbidden([{message: `You cannot access others cart`}])
        }

        const existedCartItem = await CartItemRepository.findOne({
            where: {
                pizza: {id: cartItem.pizzaID},
                crust: {id: cartItem.pizzaCrustID},
                outerCrust: {id: cartItem.pizzaOuterCrustID},
                extra: {id: cartItem.pizzaExtraID},
                size: {id: cartItem.pizzaSizeID},
                cart: {id: cartItem.cartID}
            },
            relations: {
                pizza: true, crust: true, outerCrust: true, extra: true, size: true, cart: {cartItems: true}
            }
        });

        if (existedCartItem) {
            existedCartItem.quantity += 1;
            await CartItemRepository.save(existedCartItem);

            return res.Ok(existedCartItem);
        }

        const createdCartItem = new CartItem();
        createdCartItem.quantity = 1;
        createdCartItem.cart = existedCart;
        createdCartItem.pizza = existedPizza;
        createdCartItem.crust = pizzaCrust;
        createdCartItem.outerCrust = pizzaOuterCrust;
        createdCartItem.extra = pizzaExtra;
        createdCartItem.size = pizzaSize;
        createdCartItem.note = cartItem.note || "";

        await CartItemRepository.save(createdCartItem);

        res.Ok(createdCartItem);
    } catch (e) {
        logger.error(e);
        res.InternalServerError({});
    }
}