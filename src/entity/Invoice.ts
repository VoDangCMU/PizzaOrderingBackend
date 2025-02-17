import {Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToOne, JoinColumn} from "typeorm";
import User from "@root/entity/User";
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

    @ManyToOne(() => User, { onDelete: "CASCADE" })
    @JoinColumn({name: 'userId'})
    user: User;

    @OneToOne(() => Cart)
    @JoinColumn({name: 'cartId'})
    cart: Cart;
}