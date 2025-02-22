import {z} from "zod";
import {Request, Response} from "express";
import logger from "@root/logger";
import {AppDataSource} from "@root/data-source";
import User from "@root/entity/Users";

const UserUpdateSchema = z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email().optional(),
    address: z.string().optional(),
    dateOfBirth: z.union([z.string().transform(Date), z.date()]).optional(),
});

const UserRepository = AppDataSource.getRepository(User);

export async function updateUserById(req: Request, res: Response) {
    const userId = Number(req.userID);
    const paramId = Number(req.params.id);
    console.log("userLoggedId:", userId, "paramId:", paramId);

    if(userId !== paramId) {
        res.BadRequest("Bad Request");
        return;
    }

    const parseBody = UserUpdateSchema.safeParse(req.body);
    if(parseBody.error){
        res.BadRequest(parseBody.error);
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
            Object.assign(user, parseBody.data);
            UserRepository.save(user);
            res.send("User updated successfully");
        })
        .catch(err => {
            logger.error(err);
        })
}