import {Request, Response} from 'express';
import {AppDataSource} from "@root/data-source";
import CartItem from "@root/entity/CartItem";
import logger from "@root/logger";

const CartItemRepository = AppDataSource.getRepository(CartItem);

export default async function getAllCartItems(req: Request, res: Response) {
    try{
        const cartItems = await CartItemRepository.find();

        res.Ok(cartItems);
    } catch(error) {
        logger.error(error);
        res.InternalServerError({});
    }
}
