import {Request, Response} from "express";
import {z} from "zod";
import {extractErrorsFromZod} from "@root/utils";
import logger from "@root/logger";
import {AppDataSource} from "@root/data-source";
import CartItem from "@root/entity/CartItem";
import Pizza from "@root/entity/Pizza";
import Cart from "@root/entity/Cart";

const CartItemRepository = AppDataSource.getRepository(CartItem);
const PizzaRepository = AppDataSource.getRepository(Pizza);
const CartRepository = AppDataSource.getRepository(Cart);

const CreateCartItemSchema = z.object({
    pizzaID: z.string().regex(/^\d+$/).transform(Number),
    cartID: z.string().regex(/^\d+$/).transform(Number),
    quantity: z.string().regex(/^\d+$/).transform(Number),
    size: z.enum(['S', 'M', 'L', 'XL', 'XXL']),
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

    const cartItem = parsed;

    const existedPizza = await PizzaRepository.findOne({
        where: {id: cartItem.pizzaID},
    })

    if (!existedPizza) {
        return res.NotFound([{message: `Pizza with id ${cartItem.pizzaID} not found.`}])
    }

    const existedCart = await CartRepository.findOne({
        where: {id: cartItem.cartID},
        relations: {cartItems: true}
    })

    if (!existedCart) {
        return res.NotFound([{message: `Cart with id ${cartItem.cartID} not found.`}])
    }

    const existedCartItem = await CartItemRepository.findOne({
        where: {pizza: {id: cartItem.pizzaID}, cart: {id: cartItem.cartID}},
        relations: {
            pizza: true, cart: {cartItems: true}
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
    createdCartItem.size = cartItem.size;
    createdCartItem.note = cartItem.note || "";

    res.Ok(createdCartItem);
}