import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import Pizza from "@root/entity/Pizza";

export const PIZZAIMAGES_TABLE_NAME = 'pizza_images';

@Entity({name: PIZZAIMAGES_TABLE_NAME})
export default class PizzaImages {
    @PrimaryGeneratedColumn({type: "bigint"})
    id: number;

    @Column({default: "https://delivery.pizza4ps.com/_next/image?url=https%3A%2F%2Fstorage.googleapis.com%2F4ps_strapi%2FPizza_Combo_195_K_38158f7caf%2FPizza_Combo_195_K_38158f7caf.jpg&w=1920&q=75"})
    src: string;

    @Column({default: "A big BIG pizza"})
    alt: string;

    @ManyToOne(() => Pizza, {onDelete: "CASCADE"})
    pizza: Pizza;
}