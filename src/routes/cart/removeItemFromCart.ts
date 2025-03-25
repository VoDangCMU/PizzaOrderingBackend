import {Request, Response} from "express";
import {z} from "zod";
import {extractErrorsFromZod} from "@root/utils";
import logger from "@root/logger";
import {AppDataSource} from "@root/data-source";
import CartItem from "@root/entity/CartItem";

const CartItemRepository = AppDataSource.getRepository(CartItem);

export default async function removeItemFromCart(req: Request, res: Response) {
    let cartItemID;
    try {
        cartItemID = z.string().regex(/^\d+$/).transform(Number).parse(req.params.id);
    } catch (error) {
        logger.warn(error);
        return res.BadRequest(extractErrorsFromZod(error));
    }

    try {
        const existedCartItem = await CartItemRepository.findOne({
            where: {id: cartItemID}
        });

        if (existedCartItem) {
            if (existedCartItem.quantity > 1) {
                existedCartItem.quantity -= 1;
                await CartItemRepository.save(existedCartItem);
            }
            await CartItemRepository.delete(existedCartItem.id);

            return res.Ok(existedCartItem);
        }

        return res.NotFound([{message: `Could not find cart item with id ${cartItemID}`}]);
    } catch (e) {
        logger.error(e);
        return res.InternalServerError({});
    }
}