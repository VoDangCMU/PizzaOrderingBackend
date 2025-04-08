import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import Pizza from "@root/entity/Pizza";
import PIZZA_SIZE from "@root/schemas/CONST/PIZZA_SIZE";

export const PIZZAEXTRAS_TABLE_NAME = "pizza_extras";

@Entity({ name: PIZZAEXTRAS_TABLE_NAME })
export default class PizzaExtras {
    @PrimaryGeneratedColumn({type: 'bigint'})
    id: number;

    @Column({default: PIZZA_SIZE[0], enum: PIZZA_SIZE})
    size: string;

    @Column({default: 'Extra Cheese'})
    extra: string;

    @Column({default: 1000, type: 'decimal'})
    price: number;

    @Column({
        default: "https://i.imgur.com/JB4UIiM.png",
    })
    image: string;

    @ManyToOne(() => Pizza, {onDelete: "CASCADE"})
    pizza: Pizza;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}