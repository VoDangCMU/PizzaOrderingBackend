import {NextFunction, Request, Response} from "express";

export function injectCoreServices(req: Request, res: Response, next: NextFunction) {
    res.Ok = function (data: any = {}) {
        this.status(200).json({
            data: data,
            statusCode: 200,
        });
    }

    res.BadRequest = function (message: string = "Bad Request") {
        this.status(400).json({
            message: message,
            statusCode: 400
        });
    }

    res.Unauthorized = function (message: string = "Unauthorized") {
        this.status(401).json({
            message: message,
            statusCode: 401
        })
    }

    res.Forbidden = function (message: string = "Forbidden") {
        this.status(403).json({
            message: message,
            statusCode: 403
        })
    }

    res.InternalServerError = function (message: string = "Internal Server Error") {
        this.status(500).json({
            message: message,
            statusCode: 500
        })
    }

    next();
}