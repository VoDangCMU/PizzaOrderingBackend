import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import Pizza from "@root/entity/Pizza";

export const PIZZAEXTRAS_TABLE_NAME = "pizza_extras";

@Entity({ name: PIZZAEXTRAS_TABLE_NAME })
export default class PizzaExtras {
    @PrimaryGeneratedColumn({type: 'bigint'})
    id: number;

    @Column({default: 'S', enum: ['S', 'M', 'L', 'XL', 'XXL']})
    size: string;

    @Column({default: 'Extra Cheese'})
    extra: string;

    @Column({default: 1000, type: 'bigint'})
    price: number;

    @Column({
        default: "https://delivery.pizza4ps.com/_next/image?url=https%3A%2F%2Fstorage.googleapis.com%2F4ps_strapi%2FPizza_Combo_195_K_38158f7caf%2FPizza_Combo_195_K_38158f7caf.jpg&w=1920&q=75",
    })
    image: string;

    @ManyToOne(() => Pizza, {onDelete: "CASCADE"})
    pizza: Pizza;
}