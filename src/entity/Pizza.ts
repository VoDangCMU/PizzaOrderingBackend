import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import PizzaCategory from "@root/entity/PizzaCategory";

export const PIZZA_TABLE_NAME = "pizzas";

@Entity({name: PIZZA_TABLE_NAME})
export default class Pizza {
    @PrimaryGeneratedColumn({type: "bigint"})
    id: number;

    @Column()
    name: string;

    @Column()
    ingredient: string;

    @ManyToOne(() => PizzaCategory, { onDelete: "CASCADE" })
    @JoinColumn({name: 'categoryId'})
    category: PizzaCategory;
}