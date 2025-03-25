import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn} from 'typeorm';

export const INGREDIENT_TABLE_NAME = 'ingredients';

@Entity({name: INGREDIENT_TABLE_NAME})
export default class Ingredients {
    @PrimaryGeneratedColumn({type: "bigint"})
    id: number;

    @Column({ unique: true })
    name: string;

    @Column({default: "https://i.imgur.com/JvjEmTP.png"})
    image: string;

    @Column({default: ""})
    description: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}