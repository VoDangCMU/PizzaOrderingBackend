import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import Pizza from "@root/entity/Pizza";

export const PIZZAIMAGES_TABLE_NAME = 'pizza_images';

@Entity({name: PIZZAIMAGES_TABLE_NAME})
export default class PizzaImages {
    @PrimaryGeneratedColumn({type: "bigint"})
    id: number;

    @Column({default: "https://i.imgur.com/BXEIALV.png"})
    src: string;

    @Column({default: "A big BIG pizza"})
    alt: string;

    @ManyToOne(() => Pizza, {onDelete: "CASCADE"})
    pizza: Pizza;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}