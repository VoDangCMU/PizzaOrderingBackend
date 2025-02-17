import {Request, Response} from "express";
import {z} from "zod";
import {AppDataSource} from "@root/data-source";
import Users from "@root/entity/Users";
import {compareSync} from "bcrypt";
import jwt from 'jsonwebtoken';
import env from "@root/env";
const UserRepository = AppDataSource.getRepository(Users);

const LoginParamsSchema = z.object({
    username: z.string(),
    password: z.string(),
    keepLogin: z.union([z.string(), z.boolean()]).optional().default(false),
})

export default async function login(req: Request, res: Response) {
    console.log(req.body);

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

            if (compareSync(loginParams.password, user.password)) {

                const token = jwt.sign({
                    username: loginParams.username,
                    userID: user.id,
                }, env.JWT_SECRET, {
                    algorithm: "HS256",
                    expiresIn: "7d",
                })

                res.Ok(token);
                return;
            }

            res.BadRequest("Password does not match.");
        })
        .catch(err => res.InternalServerError(err));
}