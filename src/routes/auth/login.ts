import {Request, Response} from "express";
import {z} from "zod";
import {AppDataSource} from "@root/data-source";
import User from "@root/entity/User";
import {compareSync} from "bcrypt";
import jwt from 'jsonwebtoken';
import env from "@root/env";
import logger from "@root/logger";
const UserRepository = AppDataSource.getRepository(User);

const LoginParamsSchema = z.object({
    username: z.string(),
    password: z.string(),
    keepLogin: z.union([z.string(), z.boolean()]).optional().default(false),
})

export default async function login(req: Request, res: Response) {
    logger.debug("Request Body", req.body);

    const parsed = LoginParamsSchema.safeParse(req.body);

    if (parsed.error) {
        res.BadRequest(parsed.error);
        return;
    }

    const loginParams = parsed.data;

    UserRepository.findOne({
        where: [
            {username: loginParams.username},
            {email: loginParams.username},
        ],
        select: { username: true, password: true, id: true },
    })
        .then(user => {
            if (!user) {
                res.BadRequest("Username does not exist.");
                return;
            }

            logger.debug(user);

            if (compareSync(loginParams.password, user.password)) {

                const token = jwt.sign({
                    username: loginParams.username,
                    userID: user.id,
                }, env.JWT_SECRET, {
                    algorithm: "HS256",
                    expiresIn: "7d",
                })

                logger.debug("TOKEN", token);

                res.Ok(token);
                return;
            }

            res.BadRequest("Password does not match.");
        })
        .catch(err => {
            logger.error(err);
            res.InternalServerError(err)
        });
}