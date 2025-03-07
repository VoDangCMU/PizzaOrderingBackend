import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import Pizza from "@root/entity/Pizza";

export const PIZZASIZE_TABLE_NAME = "PizzaSize";

@Entity({ name: PIZZASIZE_TABLE_NAME })
export default class PizzaSize {
    @PrimaryGeneratedColumn({type: 'bigint'})
    id: number;

    @Column({default: 'S', enum: ['S', 'M', 'L', 'XL', 'XXL']})
    size: string;

    @Column({default: 1000, type: 'bigint'})
    price: number;

    @Column({
        default: "https://delivery.pizza4ps.com/_next/image?url=https%3A%2F%2Fstorage.googleapis.com%2F4ps_strapi%2FPizza_Combo_195_K_38158f7caf%2FPizza_Combo_195_K_38158f7caf.jpg&w=1920&q=75",
    })
    image: string;

    @ManyToOne(() => Pizza, {onDelete: "CASCADE"})
    pizza: Pizza;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}