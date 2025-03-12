import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';
import Cart from "@root/entity/Cart";
import Pizza from "@root/entity/Pizza";
import PizzaSize from "@root/entity/PizzaSize";
import PizzaExtras from "@root/entity/PizzaExtras";
import PizzaCrust from "@root/entity/PizzaCrust";
import PizzaOuterCrust from "@root/entity/PizzaOuterCrust";

export const CARTITEM_TABLE_NAME = "cart_items";

@Entity({name: CARTITEM_TABLE_NAME})
export default class CartItem {
    @PrimaryGeneratedColumn({type: "bigint"})
    id: number;

    @Column()
    quantity: number;

    @ManyToOne(() => Cart, {onDelete: "CASCADE"})
    cart: Cart;

    @ManyToOne(() => Pizza, {onDelete: "CASCADE"})
    pizza: Pizza;

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @Column({default: ""})
    note: string;

    @ManyToOne(() => PizzaCrust, {onDelete: "CASCADE", nullable: true})
    crustType: PizzaCrust;

    @ManyToOne(() => PizzaExtras, {onDelete: "CASCADE", nullable: true})
    extra: PizzaExtras;

    @ManyToOne(() => PizzaSize, {onDelete: "CASCADE", nullable: true})
    size: PizzaSize

    @ManyToOne(() => PizzaOuterCrust, {onDelete: "CASCADE", nullable: true})
    outerCrust: PizzaOuterCrust;
}