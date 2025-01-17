declare namespace Express {
    export interface Response {
        Ok(data: any): void
        BadRequest(message: string): void
        Unauthorized(message: string): void
        Forbidden(message: string): void
        InternalServerError(message: string): void
    }
}