declare namespace Express {
    export interface Response {
        Ok(data: any): void
        BadRequest(detail: any, message: string = "Bad Request"): void
        Unauthorized(detail: any, message: string = "Unauthorized"): void
        Forbidden(detail: any, message: string = "Forbidden"): void
        InternalServerError(detail: any, message: string = "Internal Server Error"): void
    }
}