import {Request, Response} from "express";
import {AppDataSource} from "@root/data-source";
import User from "@root/entity/Users";
import logger from "@root/logger";
import express from "express";
import {z} from "zod";

const user = express.Router();
user.get("/:id", getUserById);
module.exports = user;

const UserIdSchema = z.object({
    id: z.string().transform((val) => parseInt(val, 10)),
})

const UserRepository = AppDataSource.getRepository(User);

export default async function getUserById (req: Request, res: Response) {
    const userId = req.params.id;

    const parse = UserIdSchema.safeParse({id: userId});
    if(parse.error){
        res.BadRequest(parse.error);
        return;
    }

    const userIdParsed = parse.data.id;

    UserRepository.findOne({
        where: {id: Number(userIdParsed)},
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
        })
}