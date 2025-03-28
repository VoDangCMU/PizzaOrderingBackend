import {Request, Response} from "express";
import Users from "@root/entity/Users";
import bcrypt from "bcrypt";
import {z} from "zod";
import {AppDataSource} from "@root/data-source";
import logger from "@root/logger";
import {extractErrorsFromZod} from "@root/utils";

const RegisterParamsSchema = z.object({
    username: z.string(),
    password: z.string(),
    dateOfBirth: z.union([z.string().transform(Date), z.date()]),
    firstName: z.string(),
    lastName: z.string(),
    phone: z.string(),
    email: z.string().email(),
    address: z.string(),
    role: z.string().optional(),
})

const UserRepository = AppDataSource.getRepository(Users);

export default function registerAdmin(req: Request, res: Response) {
    logger.debug("Request Body", req.body);
    const parsed = RegisterParamsSchema.safeParse(req.body);

    if (parsed.error) {
        logger.warn(parsed.error);
        res.BadRequest(extractErrorsFromZod(parsed.error));
        return;
    }

    const userData = parsed.data;
    UserRepository.findOne({
        where: [
            {email: userData.email},
            {username: userData.username},
        ]
    })
        .then((existedUser) => {
            if (existedUser) {
                logger.debug("Existed User", existedUser);
                res.BadRequest("Username or Email already exists");
                return;
            }

            const user = new Users();

            user.username = userData.username;
            user.email = userData.email;
            user.address = userData.address;
            user.phone = userData.phone;
            user.password = bcrypt.hashSync(userData.password, 10);
            user.firstName = userData.firstName;
            user.lastName = userData.lastName;
            user.dateOfBirth = new Date(userData.dateOfBirth);
            user.role = "admin";

            UserRepository.save(user)
                .then(() => {
                    UserRepository.findOne({where: {email: userData.email}})
                        .then((createdUser) => res.Ok(createdUser));
                })
                .catch((err) => {
                    logger.error(err);
                    res.InternalServerError({});
                });
        })
        .catch((err) => {
            logger.error(err);
            res.InternalServerError({});
        });
}