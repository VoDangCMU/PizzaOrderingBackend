import {NextFunction, Request, Response} from "express";
import env from "@root/env";

export default function isOnTesting(req: Request, res: Response, next: NextFunction) {
    if (env.ENV !== "testing")
        return res.Forbidden([{message: "Not in testing mode"}]);

    next();
}