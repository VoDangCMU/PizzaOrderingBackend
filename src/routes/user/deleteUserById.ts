import {Request, Response} from "express";
import logger from "@root/logger";
import {AppDataSource} from "@root/data-source";
import User from "@root/entity/Users";

const UserRepository = AppDataSource.getRepository(User);

export async function deleteUserById (req: Request, res: Response) {
    const userId = Number(req.userID);
    const paramId = Number(req.params.id);
    if(userId !== paramId) {
        res.BadRequest("Bad Request");
        return;
    }

    UserRepository.findOne({
        where: {id: userId}
    })
        .then(user => {
            if (!user) {
                res.BadRequest("User not found");
                return;
            }
            UserRepository.remove(user);
            res.send("User deleted");
        })
        .catch(err => {
            logger.error(err);
        })
}