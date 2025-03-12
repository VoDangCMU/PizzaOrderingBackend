import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import Pizza from "@root/entity/Pizza";
import PIZZA_CRUST_TYPE from "@root/schemas/CONST/PIZZA_CRUST_TYPE";

export const PIZZACRUST_TABLE_NAME = "pizza_crust";

@Entity({ name: PIZZACRUST_TABLE_NAME })
export default class PizzaCrust {
    @PrimaryGeneratedColumn({type: 'bigint'})
    id: number;

    @Column({default: PIZZA_CRUST_TYPE[0], enum: PIZZA_CRUST_TYPE})
    crust: string;

    @Column({
        default: "https://i.imgur.com/dlk37Sb.jpeg",
    })
    image: string;

    @ManyToOne(() => Pizza, {onDelete: "CASCADE"})
    pizza: Pizza;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}