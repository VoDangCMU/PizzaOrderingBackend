import {Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn} from 'typeorm';
import User from "@root/entity/User";

export const CART_TABLE_NAME = "carts";

@Entity({name: CART_TABLE_NAME})
export default class Cart {
    @PrimaryGeneratedColumn({type: "bigint"})
    id: number;

    @OneToOne(() => User, (user) => user.cart)
    @JoinColumn({name: 'userId'})
    user: User;
}