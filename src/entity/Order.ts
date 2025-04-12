import {CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';
import Users from "@root/entity/Users";
import OrderItem from "@root/entity/OrderItem";

export const ORDER_TABLE_NAME = "orders";

@Entity({name: ORDER_TABLE_NAME})
export default class Order {
    @PrimaryGeneratedColumn({type: "bigint"})
    id: number;

    @ManyToOne(() => Users, {onDelete: "CASCADE"})
    user: Users;

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @OneToMany(() => OrderItem, (cartItem) => cartItem.order, {onDelete: "CASCADE"})
    orderItems: Array<OrderItem>;
}