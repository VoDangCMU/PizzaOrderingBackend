import {Entity, Column, PrimaryGeneratedColumn} from "typeorm"

export const USER_TABLE_NAME = "users";

@Entity({name: USER_TABLE_NAME})
export class User {
    @PrimaryGeneratedColumn({type: "bigint"})
    id: number

    @Column()
    username: string

    @Column()
    password: string

    @Column()
    dateOfBirth: Date

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column()
    phone: string

    @Column()
    email: string

    @Column()
    address: string
}