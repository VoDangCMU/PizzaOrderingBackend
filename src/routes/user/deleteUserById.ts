import {Request, Response} from "express";
import logger from "@root/logger";
import {AppDataSource} from "@root/data-source";
import User from "@root/entity/Users";
import {z} from "zod";

const UserIdSchema = z.object({
    id: z.union([z.string().regex(/^\d+$/), z.number()]).transform(Number)
})

const UserRepository = AppDataSource.getRepository(User);

export default async function deleteUserById (req: Request, res: Response) {
    const userLoggedId = Number(req.userID);
    const userId = req.params.id;

    const parsedId = UserIdSchema.safeParse({id: userId});
    if(parsedId.error){
        res.BadRequest(parsedId.error);
        return;
    }

    const userIdParsed = parsedId.data.id;
    if(userLoggedId !== userIdParsed) {
        res.Forbidden("Forbidden");
        return;
    }

    UserRepository.findOne({
        where: {
            id: userIdParsed
        },
    })
        .then(user => {
            if (!user) {
                res.NotFound("User not found");
                return;
            }
            UserRepository.delete(userIdParsed)
                .then(()=>{
                    res.Ok("User deleted successfully");
                })
                .catch(err => {
                    logger.error(err);
                })
        })
        .catch(err => {
            logger.error(err);
        })
}