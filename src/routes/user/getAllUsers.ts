import {Request, Response} from 'express';
import {AppDataSource} from "@root/data-source";
import Users from "@root/entity/Users";
import logger from "@root/logger";

const UserRepository = AppDataSource.getRepository(Users);

export default async function getAllUsers (req: Request, res: Response) {
    try {
        const users = await UserRepository.find();

        res.Ok(users);
    } catch(error) {
        logger.error(error);
        res.InternalServerError({});
    }
}