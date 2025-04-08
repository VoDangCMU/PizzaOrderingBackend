import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import Pizza from "@root/entity/Pizza";
import PIZZA_CRUST from "@root/schemas/CONST/PIZZA_CRUST";

export const PIZZACRUST_TABLE_NAME = "pizza_crust";

@Entity({ name: PIZZACRUST_TABLE_NAME })
export default class PizzaCrust {
    @PrimaryGeneratedColumn({type: 'bigint'})
    id: number;

    @Column({default: PIZZA_CRUST[0], enum: PIZZA_CRUST})
    crust: string;

    @Column({
        default: "https://i.imgur.com/dlk37Sb.jpeg",
    })
    image: string;

    @ManyToOne(() => Pizza, {onDelete: "CASCADE"})
    pizza: Pizza;

    @Column({type: 'decimal', default: 100})
    price: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}