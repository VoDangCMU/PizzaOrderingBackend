import {z} from "zod";
import {Request, Response} from "express";
import logger from "@root/logger";
import {AppDataSource} from "@root/data-source";
import User from "@root/entity/Users";
import bcrypt from "bcrypt";

const UserUpdateSchema = z.object({
    id: z.union([z.string().regex(/^\d+$/), z.number()]).transform(Number).optional(),
    username: z.string().optional(),
    oldPassword: z.string().optional(),
    newPassword: z.string().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email().optional(),
    address: z.string().optional(),
    dateOfBirth: z.union([z.string().transform(Date), z.date()]).optional(),
});

const UserRepository = AppDataSource.getRepository(User);

export default async function updateUserById(req: Request, res: Response) {
    const userLoggedId = Number(req.userID);
    const userId = req.params.id;

    const parsedId = UserUpdateSchema.safeParse({id: userId});
    if(parsedId.error){
        res.BadRequest(parsedId.error);
        return;
    }

    const userIdParsed = parsedId.data.id;
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
        const updatedUser = await UserRepository.findOne({
            where: {id: userIdParsed},
            select: {password: true}
        })
        if(!updatedUser) {
            res.NotFound("User not found");
            return;
        }

        if (parsedBody.data.newPassword) {
            if (!parsedBody.data.oldPassword) {
                res.BadRequest("Old password is required to change password");
                return;
            }

            const isMatch = await bcrypt.compare(parsedBody.data.oldPassword, updatedUser.password);
            if (!isMatch) {
                res.BadRequest("Old password is incorrect");
                return;
            }

            updatedUser.password = await bcrypt.hash(parsedBody.data.newPassword, 10);
        }

        Object.assign(updatedUser, parsedBody.data);
        await UserRepository.save(updatedUser);

        res.Ok(updatedUser);
    } catch (error) {
        logger.error(error);
    }
}