import {Request, Response} from "express";
import logger from "@root/logger";
import {AppDataSource} from "@root/data-source";
import Users from "@root/entity/Users";
import Cart from "@root/entity/Cart";

const UserRepository = AppDataSource.getRepository(Users);
const CartRepository = AppDataSource.getRepository(Cart);

export default async function createCart(req: Request, res: Response) {
    const userID = req.userID;
    
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