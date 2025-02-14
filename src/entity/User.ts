import {Column, Entity, PrimaryGeneratedColumn, OneToOne, OneToMany} from "typeorm"
import Invoice from "@root/entity/Invoice";
import Cart from "@root/entity/Cart";

export const USER_TABLE_NAME = "users";

@Entity({name: USER_TABLE_NAME})
export default class User {
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

    @OneToMany(type => Invoice, (invoice) => invoice.user)
    invoice: Invoice;

    @OneToOne(type => Cart, (cart) => cart.user)
    cart: Cart;
}