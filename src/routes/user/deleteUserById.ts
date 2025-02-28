import {Request, Response} from "express";
import logger from "@root/logger";
import {AppDataSource} from "@root/data-source";
import User from "@root/entity/Users";
import {z} from "zod";

const UserIdSchema = z.object({
    id: z.number(),
})

const UserRepository = AppDataSource.getRepository(User);

export async function deleteUserById (req: Request, res: Response) {
    const userLoggedId = Number(req.userID);
    const userId = parseInt(req.params.id, 10);

    const parsed = UserIdSchema.safeParse({id: userId});
    if(parsed.error){
        res.BadRequest(parsed.error);
        return;
    }

    const userIdParsed = parsed.data.id;
    if(userLoggedId !== userIdParsed) {
        res.Forbidden("Forbidden");
        return;
    }

    try {
        const user = await UserRepository.findOne({
            where: {id: userIdParsed},
        })

        if(!user) {
            res.BadRequest("User not found");
            return;
        }
        await UserRepository.delete(userIdParsed);
        res.Ok("User deleted successfully");
    } catch (error) {
        logger.error(error);
    }
}