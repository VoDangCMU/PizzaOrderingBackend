import { Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

export const PIZZACATEGORY_TABLE_NAME = 'pizza_categories';

@Entity({name: PIZZACATEGORY_TABLE_NAME})
export default class PizzaCategory {
    @PrimaryGeneratedColumn({name: "bigint"})
    id: number;

    @Column()
    name: string;
}