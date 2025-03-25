import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm"
import USER_ROLE from "@root/schemas/CONST/USER_ROLE";

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

    @Column({default: "https://i.imgur.com/oKuKLoh.png"})
    avatar: string

    @Column({default: USER_ROLE[0], enum: USER_ROLE})
    role: string

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}