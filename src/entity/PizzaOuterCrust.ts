import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import Pizza from "@root/entity/Pizza";
import PIZZA_SIZE from "@root/schemas/CONST/PIZZA_SIZE";

export const PIZZA_OUTERCRUST_TABLE_NAME = "pizza_outer_crust";

@Entity({ name: PIZZA_OUTERCRUST_TABLE_NAME })
export default class PizzaOuterCrust {
    @PrimaryGeneratedColumn({type: 'bigint'})
    id: number;

    @Column({default: PIZZA_SIZE[0], enum: PIZZA_SIZE})
    size: string;

    @Column({default: 1000, type: 'bigint'})
    price: number;

    @Column()
    name: string;

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