import {Request, Response} from "express";
import {z} from "zod";
import logger from "@root/logger";
import {extractErrorsFromZod} from "@root/utils";
import {AppDataSource} from "@root/data-source";
import CartItem from "@root/entity/CartItem";

const CartItemRepository = AppDataSource.getRepository(CartItem);

const UpdateCartItemSchema = z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
    quantity: z.string().regex(/^\d+$/).transform(Number),
    size: z.enum(['S', 'M', 'L', 'XL', 'XXL']),
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

        existedCartItem.quantity = newCartItem.quantity;
        existedCartItem.size = newCartItem.size;
        existedCartItem.note = newCartItem.note || "";

        await CartItemRepository.save(existedCartItem);

        return res.Ok(existedCartItem);
    } catch (error) {
        logger.error(error);
        return res.InternalServerError({});
    }
}