import {Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import Users from "@root/entity/Users";
import Cart from "@root/entity/Cart";

export const INVOICE_TABLE_NAME = "invoices";

@Entity({name: INVOICE_TABLE_NAME})
export default class Invoice {
    @PrimaryGeneratedColumn({type: "bigint"})
    id: number;

    @Column()
    cartId: number;

    @Column()
    price: number;

    @Column()
    paid: boolean;

    @ManyToOne(() => Users, {onDelete: "CASCADE"})
    user: Users;

    @OneToOne(() => Cart, {onDelete: "CASCADE"})
    cart: Cart;
}