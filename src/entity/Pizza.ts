import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import PizzaCategories from "@root/entity/PizzaCategories";
import PizzaCrust from "@root/entity/PizzaCrust";
import PizzaExtras from "@root/entity/PizzaExtras";
import PizzaImages from "@root/entity/PizzaImages";
import PizzaSize from "@root/entity/PizzaSize";

export const PIZZA_TABLE_NAME = "pizzas";

@Entity({name: PIZZA_TABLE_NAME})
export default class Pizza {
    @PrimaryGeneratedColumn({type: "bigint"})
    id: number;

    @Column()
    name: string;

    @ManyToOne(() => PizzaCategories, {onDelete: "CASCADE"})
    category: PizzaCategories;

    @Column({default: ""})
    description: string;

    @OneToMany(() => PizzaCrust, (pizzaCrust) => pizzaCrust.pizza, {onDelete: "CASCADE"})
    crusts: Array<PizzaCrust>;

    @OneToMany(() => PizzaExtras, (pizzaExtras) => pizzaExtras.pizza, {onDelete: "CASCADE"})
    extras: Array<PizzaExtras>;

    @OneToMany(() => PizzaImages, (pizzaImages) => pizzaImages.pizza, {onDelete: "CASCADE"})
    images: Array<PizzaImages>;

    @OneToMany(() => PizzaSize, (pizzaSize) => pizzaSize.pizza, {onDelete: "CASCADE"})
    sizes: Array<PizzaSize>;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}