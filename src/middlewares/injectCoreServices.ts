import {NextFunction, Request, Response} from "express";
import {randomUUID} from "@root/utils";
import logger from "@root/logger";

export function injectCoreServices(req: Request, res: Response, next: NextFunction) {
    res.Ok = function (data: any = {}) {
        this.status(200).json({
            data: data,
            statusCode: 200,
        });
    }

    res.BadRequest = function (detail: any, message: string = "Bad Request") {
        this.status(400).json({
            message: message,
            detail,
            statusCode: 400
        });
    }

    res.Unauthorized = function (detail: any, message: string = "Unauthorized") {
        this.status(401).json({
            message: message,
            detail,
            statusCode: 401
        })
    }

    res.Forbidden = function (detail: any, message: string = "Forbidden") {
        this.status(403).json({
            message: message,
            detail,
            statusCode: 403
        })
    }

    res.InternalServerError = function (error: any, message: string = "Internal Server Error") {
        const tracebackId = randomUUID();
        logger.error(tracebackId, error);

        this.status(500).json({
            message: message,
            "trace-id": tracebackId,
            statusCode: 500
        })
    }

    res.NotFound = function (detail: any, message: string = "Resource Not Found") {
        this.status(404).json({
            message: message,
            detail,
            statusCode: 404
        })
    }

    next();
}