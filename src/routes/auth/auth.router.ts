import {Request, Response, Router} from 'express';
import User from "@root/entity/User";
import {AppDataSource} from "@root/data-source";
import bcrypt from "bcrypt";
import {z} from "zod";

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
const auth = Router();

auth.post('/login', (req: Request, res: Response) => {

})

auth.post('/register', (req: Request, res: Response) => {
    console.log(req.body);
    const parsed = RegisterParamsSchema.safeParse(req.body);

    if(parsed.error){
        res.BadRequest(parsed.error);
        return;
    }
    console.log(parsed.data);

    const userData = parsed.data;
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
        .then(() => {res.Ok("Work");})
        .catch((err) => {res.InternalServerError(err)});
})

module.exports = auth;