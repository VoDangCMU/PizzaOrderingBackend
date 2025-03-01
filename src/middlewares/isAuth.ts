import {NextFunction, Request, Response} from "express";
import jwt from "jsonwebtoken";
import env from "@root/env";
import logger from "@root/logger";

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

        logger.debug("Logged in with ", decoded)
        req.username = decoded.username;
        req.userID = decoded.userID;

        next();
    });
}