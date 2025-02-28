import {z} from "zod";
import {Request, Response} from "express";
import logger from "@root/logger";
import {AppDataSource} from "@root/data-source";
import User from "@root/entity/Users";
import bcrypt from "bcrypt";

const UserUpdateSchema = z.object({
    id: z.number().optional(),
    username: z.string().optional(),
    password: z.string().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email().optional(),
    address: z.string().optional(),
    dateOfBirth: z.union([z.string().transform(Date), z.date()]).optional(),
});

const UserRepository = AppDataSource.getRepository(User);

export async function updateUserById(req: Request, res: Response) {
    const userLoggedId = Number(req.userID);
    const userId = parseInt(req.params.id, 10);

    const parsed = UserUpdateSchema.safeParse({id: userId});
    if(parsed.error){
        res.BadRequest(parsed.error);
        return;
    }

    const userIdParsed = parsed.data.id;
    if(userLoggedId !== userIdParsed) {
        res.Forbidden("Forbidden");
        return;
    }

    const parsedBody = UserUpdateSchema.safeParse(req.body);
    if(parsedBody.error){
        res.BadRequest(parsedBody.error);
        return;
    }

    try {
        const user = await UserRepository.findOne({
            where: {id: userIdParsed}
        })
        if(!user) {
            res.BadRequest("User not found");
            return;
        }

        if(parsedBody.data.password) {
            parsedBody.data.password = await bcrypt.hash(parsedBody.data.password, 10);
        }

        Object.assign(user, parsedBody.data);
        await UserRepository.save(user);

        res.Ok("User updated");
    } catch (error) {
        logger.error(error);
    }
}