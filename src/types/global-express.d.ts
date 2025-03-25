declare type Users = {
    id: number
    username: string
    password: string
    dateOfBirth: Date
    firstName: string
    lastName: string
    phone: string
    email: string
    address: string
    createdAt: Date
    updatedAt: Date
}

declare namespace Express {
    export interface Response {
        Ok(data: any): void
        BadRequest(detail: any, message: string = "Bad Request"): void
        Unauthorized(detail: any, message: string = "Unauthorized"): void
        Forbidden(detail: any, message: string = "Forbidden"): void
        InternalServerError(detail: any, message: string = "Internal Server Error"): void
        NotFound(detail: any, message: string = "Resource Not Found"): void
    }

    export interface Request {
        userID: number
        username: string
        currentUser: Users
    }
}