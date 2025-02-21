import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';
import Cart from "@root/entity/Cart";
import Pizza from "@root/entity/Pizza";

export const CARTITEM_TABLE_NAME = "cart_items";

@Entity({name: CARTITEM_TABLE_NAME})
export default class CartItem {
    @PrimaryGeneratedColumn({type: "bigint"})
    id: number;

    @Column()
    quantity: number;

    @Column()
    size: string;

    @ManyToOne(() => Cart, {onDelete: "CASCADE"})
    cart: Cart;

    @ManyToOne(() => Pizza, {onDelete: "CASCADE"})
    pizza: Pizza;

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}