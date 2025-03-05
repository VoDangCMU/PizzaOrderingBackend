import {Request, Response} from "express";
import {z} from "zod";
import logger from "@root/logger";
import {extractErrorsFromZod} from "@root/utils";
import {AppDataSource} from "@root/data-source";
import Cart from "@root/entity/Cart";

const CartRepository = AppDataSource.getRepository(Cart);

export default async function getCart(req: Request, res: Response) {
    const _userID = req.userID;
    const _cartID = req.params.id;
    const NumberSchema = z.string().regex(/^\d+$/).transform(Number);

    let userID, cartID;

    try {
        userID = NumberSchema.parse(_userID);
    } catch (e) {
        logger.warn(`Error: ${e}`);

        res.BadRequest(extractErrorsFromZod(e));
        return;
    }

    try {
        cartID = NumberSchema.parse(_cartID);
    } catch (e) {
        logger.warn(`Error: ${e}`);
        res.BadRequest(extractErrorsFromZod(e));
        return;
    }

    try {
        const cart = await CartRepository.findOne({
            where: {
                id: cartID,
                user: {id: userID},
            },
            relations: {user: true, cartItems: {pizza: true}}
        })

        if (!cart) {
            res.NotFound([{message: `Cart with id ${cartID} not found`}]);
            return;
        }

        if (cart.user.id != userID) {
            res.Forbidden([{message: `You cannot access otthers cart`}])
            return;
        }

        res.Ok(cart);
    } catch (e) {
        logger.error(`Error: ${e}`);
        res.InternalServerError({});
        return;
    }
}