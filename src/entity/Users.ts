import {Column, Entity, PrimaryGeneratedColumn} from "typeorm"

export const USER_TABLE_NAME = "users";

@Entity({name: USER_TABLE_NAME})
export default class Users {
    @PrimaryGeneratedColumn({type: "bigint"})
    id: number

    @Column({unique: true})
    username: string

    @Column({select: false})
    password: string

    @Column()
    dateOfBirth: Date

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column()
    phone: string

    @Column({unique: true})
    email: string

    @Column()
    address: string
}