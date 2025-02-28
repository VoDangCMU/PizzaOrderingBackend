import {Entity, PrimaryGeneratedColumn, Column} from 'typeorm';

export const INGREDIENT_TABLE_NAME = 'ingredients';

@Entity({name: INGREDIENT_TABLE_NAME})
export class Ingredients {
    @PrimaryGeneratedColumn({type: "bigint"})
    id: number;

    @Column()
    name: string;
}