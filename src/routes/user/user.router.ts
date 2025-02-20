import {Request, Response} from "express";
import {AppDataSource} from "@root/data-source";
import User from "@root/entity/Users";
import logger from "@root/logger";
import express from "express";
import {z} from "zod";

const user = express.Router();
user.get("/:id", getUserById);
user.put("/:id", updateUserById);
user.delete("/:id", deleteUserById);
module.exports = user;

const UserIdSchema = z.object({
    id: z.number(),
})

const UserUpdateSchema = z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email().optional(),
    address: z.string().optional(),
    dateOfBirth: z.union([z.string().transform(Date), z.date()]).optional(),
});

const UserRepository = AppDataSource.getRepository(User);

export async function getUserById (req: Request, res: Response) {
    const userId = parseInt(req.params.id, 10);

    const parse = UserIdSchema.safeParse({id: userId});
    if(parse.error){
        res.BadRequest(parse.error);
        return;
    }

    const userIdParsed = parse.data.id;

    UserRepository.findOne({
        where: {id: Number(userIdParsed)},
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

export async function updateUserById(req: Request, res: Response) {
    const userId = parseInt(req.params.id, 10);

    const parse = UserIdSchema.safeParse({id: userId});
    if(parse.error){
        res.BadRequest(parse.error);
        return;
    }
    const userIdParsed = parse.data.id;

    const parseBody = UserUpdateSchema.safeParse(req.body);
    if(parseBody.error){
        res.BadRequest(parse.error);
        return;
    }

    UserRepository.findOne({
        where: {id: Number(userIdParsed)},
    })
        .then(user => {
            if (!user) {
                res.BadRequest("User not found");
                return;
            }
            Object.assign(user, parseBody.data);
            UserRepository.save(user);
            res.send("User updated successfully");
        })
        .catch(err => {
            logger.error(err);
        })
}

export async function deleteUserById (req: Request, res: Response) {
    const userId = parseInt(req.params.id, 10);

    const parse = UserIdSchema.safeParse({id: userId});
    if(parse.error){
        res.BadRequest(parse.error);
        return;
    }
    const userIdParsed = parse.data.id;

    UserRepository.findOne({
        where: {id: Number(userIdParsed)},
    })
        .then(user => {
            if (!user) {
                res.BadRequest("User not found");
                return;
            }
            UserRepository.remove(user);
            res.send("User deleted successfully");
        })
        .catch(err => {
            logger.error(err);
        })
}