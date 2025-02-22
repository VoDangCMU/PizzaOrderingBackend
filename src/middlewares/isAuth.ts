import {NextFunction, Request, Response} from "express";
import jwt from "jsonwebtoken";
import env from "@root/env";

export default function isAuth(req: Request, res: Response, next: NextFunction) {
    const headerToken = req.headers.authorization;

    if (!headerToken) {
        res.Unauthorized("No token provided");
        return;
    }

    jwt.verify(headerToken, env.JWT_SECRET, (err, decoded: any) => {
        if (err) {
            res.Unauthorized("Invalid Token!");
            return;
        }

        if (!decoded) {
            res.Unauthorized("No Token Payload provided!");
            return;
        }

        req.username = decoded.username;
        req.userID = decoded.userID;
        next();
    });
}