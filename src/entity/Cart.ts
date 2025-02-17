import {Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import Users from "@root/entity/Users";

export const CART_TABLE_NAME = "carts";

@Entity({name: CART_TABLE_NAME})
export default class Cart {
    @PrimaryGeneratedColumn({type: "bigint"})
    id: number;

    @ManyToOne(() => Users, {onDelete: "CASCADE"})
    user: Users;
}