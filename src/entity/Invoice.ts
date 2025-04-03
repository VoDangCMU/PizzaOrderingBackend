import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import Users from "@root/entity/Users";
import Order from "@root/entity/Order";

export const INVOICE_TABLE_NAME = "invoices";

@Entity({name: INVOICE_TABLE_NAME})
export default class Invoice {
    @PrimaryGeneratedColumn({type: "bigint"})
    id: number;

    @Column()
    cartId: number;

    @Column()
    price: number;

    @Column({default: false})
    paid: boolean;

    @ManyToOne(() => Users, {onDelete: "CASCADE"})
    user: Users;

    @ManyToOne(() => Order, {onDelete: "CASCADE"})
    order: Order;

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}