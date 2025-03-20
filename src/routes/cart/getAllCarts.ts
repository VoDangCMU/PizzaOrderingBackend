import {Request, Response} from 'express';
import {AppDataSource} from "@root/data-source";
import Cart from "@root/entity/Cart";
import logger from "@root/logger";

const CartRepository = AppDataSource.getRepository(Cart);

export default async function getAllCarts(req: Request, res: Response) {
    try{
        const carts = await CartRepository.find();

        res.Ok(carts);
    } catch(error) {
        logger.error(error);
        res.InternalServerError({});
    }
}