import {Request, Response} from "express";
import User from "@root/entity/User";
import bcrypt from "bcrypt";
import {z} from "zod";
import {AppDataSource} from "@root/data-source";

const RegisterParamsSchema = z.object({
    username: z.string(),
    password: z.string(),
    dateOfBirth: z.union([z.string().transform(Date), z.date()]),
    firstName: z.string(),
    lastName: z.string(),
    phone: z.string(),
    email: z.string().email(),
    address: z.string(),
})

const UserRepository = AppDataSource.getRepository(User);

export default function register(req: Request, res: Response): void {
    console.log(req.body);
    const parsed = RegisterParamsSchema.safeParse(req.body);

    if (parsed.error) {
        res.BadRequest(parsed.error);
        return;
    }
    console.log(parsed.data);

    const userData = parsed.data;

    UserRepository.findOne({
        where: [
            {email: userData.email},
            {username: userData.username},
        ]
    })
        .then((existedUser) => {
            if (existedUser) {
                res.BadRequest("Username or Email already exists");
                return;
            }

            const user = new User();

            user.username = userData.username;
            user.email = userData.email;
            user.address = userData.address;
            user.phone = userData.phone;
            user.password = bcrypt.hashSync(userData.password, 10);
            user.firstName = userData.firstName;
            user.lastName = userData.lastName;
            user.dateOfBirth = new Date(userData.dateOfBirth);

            UserRepository.save(user)
                .then(() => {
                    UserRepository.findOne({where: {email: userData.email}})
                    .then((createdUser) => res.Ok(createdUser));
                })
                .catch((err) => res.InternalServerError(err));
        })
        .catch((err) => res.InternalServerError(err));
}