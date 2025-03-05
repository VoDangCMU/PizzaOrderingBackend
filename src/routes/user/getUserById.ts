import {z} from "zod";
import {AppDataSource} from "@root/data-source";
import User from "@root/entity/Users";
import {Request, Response} from "express";
import logger from "@root/logger";


const UserIdSchema = z.object({
    id: z.union([z.string().regex(/^\d+$/), z.number()]).transform(Number)
})

const UserRepository = AppDataSource.getRepository(User);

export default function getUserById (req: Request, res: Response) {
    const userId = parseInt(req.params.id, 10);

    const parsedId = UserIdSchema.safeParse({id: userId});
    if(parsedId.error){
        res.BadRequest(parsedId.error);
        return;
    }

    const userIdParsed = parsedId.data.id;

    UserRepository.findOne({
        where: {id: userIdParsed},
    })
        .then(user => {
            if (!user) {
                res.NotFound("User not found");
                return;
            }

            res.Ok(user);
        })
        .catch(err => {
            logger.error(err);
            res.InternalServerError({});
        })
}
