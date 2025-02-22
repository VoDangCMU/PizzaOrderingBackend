import {z} from "zod";
import {AppDataSource} from "@root/data-source";
import User from "@root/entity/Users";
import {Request, Response} from "express";
import logger from "@root/logger";


const UserIdSchema = z.object({
    id: z.number(),
})

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
