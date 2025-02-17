import {Request, Response} from "express";
import {AppDataSource} from "@root/data-source";
import User from "@root/entity/User";
import logger from "@root/logger";
import express from "express";

const user = express.Router();
user.get("/user/:id", getUserById);
module.exports = user;

const UserRepository = AppDataSource.getRepository(User);

export default async function getUserById (req: Request, res: Response) {
    const userId = req.params.id;

    UserRepository.findOne({
        where: {id: Number(userId)},
        select: ["id", "username", "dateOfBirth", "firstName", "lastName", "email", "phone", "address"],
    })
        .then(user => {
            if (!user) {
                res.BadRequest("User not found");
                return;
            }
            res.send(user);
        })
        .catch(err => {
            logger.error(err);
            res.InternalServerError(err);
        })
}