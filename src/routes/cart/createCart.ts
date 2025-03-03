import {z} from "zod";
import {Request, Response} from "express";
import logger from "@root/logger";
import {extractErrorsFromZod} from "@root/utils";
import {AppDataSource} from "@root/data-source";
import Users from "@root/entity/Users";
import Cart from "@root/entity/Cart";

const UserRepository = AppDataSource.getRepository(Users);
const CartRepository = AppDataSource.getRepository(Cart);

export default async function createCart(req: Request, res: Response) {
    const _userID = req.userID;
    const NumberSchema = z.string().regex(/^\d+$/).transform(Number);

    let userID;

    try {
        userID = NumberSchema.parse(_userID);
    } catch (e) {
        logger.warn(`Error: ${e}`);

        res.BadRequest(extractErrorsFromZod(e));
        return;
    }
    
    try {
        const existedUser = await UserRepository.findOne({
            where: { id: userID },
        })

        if (!existedUser) {
            res.BadRequest([{message: `User with id ${userID} not found`}]);
            return;
        }

        const existedCart = await CartRepository.findOne({
            where: { user: {id: userID} },
            relations: {
                user: true,
                cartItems: true
            }
        })

        if (existedCart) {
            res.BadRequest([{message: `Cart of user ${userID} already exist`, detail: existedCart}]);
            return;
        }

        const createdCart = new Cart();

        createdCart.user = existedUser;
        createdCart.cartItems = [];

        await CartRepository.save(createdCart);

        res.Ok(createdCart);
    } catch (e) {
        logger.error(e);
        res.InternalServerError({});
        return;
    }
}