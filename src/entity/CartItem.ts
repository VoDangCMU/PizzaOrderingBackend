import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn} from 'typeorm';
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

    @ManyToOne(() => Cart, { onDelete: "CASCADE" })
    @JoinColumn({name: 'cartId'})
    cart: Cart;

    @ManyToOne(() => Pizza, { onDelete: "CASCADE" })
    @JoinColumn({name: 'pizzaId'})
    pizza: Pizza;
}