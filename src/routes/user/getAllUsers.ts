import {Request, Response} from 'express';
import {AppDataSource} from "@root/data-source";
import Users from "@root/entity/Users";

const UserRepository = AppDataSource.getRepository(Users);

export default async function getAllUsers (req: Request, res: Response) {
    try {
        const users = await UserRepository.find();
        res.Ok(users);
    } catch(error) {
        res.InternalServerError(error);
    }
}