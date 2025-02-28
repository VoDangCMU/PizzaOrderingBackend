import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import PizzaCategories from "@root/entity/PizzaCategories";

export const PIZZA_TABLE_NAME = "pizzas";

@Entity({name: PIZZA_TABLE_NAME})
export default class Pizza {
    @PrimaryGeneratedColumn({type: "bigint"})
    id: number;

    @Column()
    name: string;

    @ManyToOne(() => PizzaCategories, {onDelete: "CASCADE"})
    category: PizzaCategories;
}