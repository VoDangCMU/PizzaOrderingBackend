import { NextFunction, Request, Response } from 'express';
import {AppDataSource} from "@root/data-source";
import Users from "@root/entity/Users";
import logger from "@root/logger";

const UserRepository = AppDataSource.getRepository(Users);

export default async function isStaff(req: Request, res: Response, next: NextFunction) {
    const userId = req.userID;

    try {
        const user = await UserRepository.findOne({
            where: {
                id: userId,
            }
        })

        if (!user) {
            res.NotFound([{message: `User with id ${userId} not found`}]);
            return;
        }

        if(user.role != "staff")
        {
            res.Forbidden("Forbidden");
            return;
        }

        return next();
    } catch (err) {
        logger.error(err);
        res.InternalServerError({});
        return;
    }
}