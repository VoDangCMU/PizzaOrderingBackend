import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';
import Order from "@root/entity/Order";
import Pizza from "@root/entity/Pizza";
import PizzaSize from "@root/entity/PizzaSize";
import PizzaExtras from "@root/entity/PizzaExtras";
import PizzaCrust from "@root/entity/PizzaCrust";
import PizzaOuterCrust from "@root/entity/PizzaOuterCrust";

export const CARTITEM_TABLE_NAME = "order_items";

@Entity({name: CARTITEM_TABLE_NAME})
export default class OrderItem {
    @PrimaryGeneratedColumn({type: "bigint"})
    id: number;

    @Column()
    quantity: number;

    @ManyToOne(() => Order, {onDelete: "CASCADE"})
    order: Order;

    @ManyToOne(() => Pizza, {onDelete: "CASCADE"})
    pizza: Pizza;

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @Column({default: ""})
    note: string;

    @ManyToOne(() => PizzaCrust, {onDelete: "CASCADE", nullable: true})
    crust: PizzaCrust | null;

    @ManyToOne(() => PizzaExtras, {onDelete: "CASCADE", nullable: true})
    extra: PizzaExtras | null;

    @ManyToOne(() => PizzaSize, {onDelete: "CASCADE", nullable: true})
    size: PizzaSize | null;

    @ManyToOne(() => PizzaOuterCrust, {onDelete: "CASCADE", nullable: true})
    outerCrust: PizzaOuterCrust | null;
}