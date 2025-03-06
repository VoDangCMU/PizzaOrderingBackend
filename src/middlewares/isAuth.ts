import {NextFunction, Request, Response} from "express";
import jwt from "jsonwebtoken";
import env from "@root/env";
import logger from "@root/logger";
import {AppDataSource} from "@root/data-source";
import Users from "@root/entity/Users";

const UserRepository = AppDataSource.getRepository(Users);

export default function isAuth(req: Request, res: Response, next: NextFunction) {
    const headerToken = req.headers.authorization;

    if (!headerToken) {
        res.Unauthorized([{mesage: "No token provided"}]);
        return;
    }

    logger.debug("Token detected", headerToken);

    jwt.verify(headerToken, env.JWT_SECRET, (err, decoded: any) => {
        if (err) {
            res.Unauthorized([{message: "Invalid Token!"}]);
            return;
        }

        if (!decoded) {
            res.Unauthorized([{message: "No Token Payload provided!"}]);
            return;
        }

        logger.debug("Token Payload ", decoded);

        UserRepository.findOne({
            where: {id: parseInt(decoded.userID, 10)},
        })
            .then(user => {
                if (!user) {
                    return res.NotFound([{message: `User with ID ${decoded.userID} not found`}]);
                }

                req.username = decoded.username;
                req.userID = parseInt(decoded.userID, 10);
                req.currentUser = user;

                next();
            })
            .catch(err => {
                logger.error(err);
                res.InternalServerError({});
            })

    });
}