import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';

export const PIZZACATEGORY_TABLE_NAME = 'pizza_categories';

@Entity({name: PIZZACATEGORY_TABLE_NAME})
export default class PizzaCategories {
    @PrimaryGeneratedColumn({type: "bigint"})
    id: number;

    @Column()
    name: string;

    @Column({default: ""})
    description: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}