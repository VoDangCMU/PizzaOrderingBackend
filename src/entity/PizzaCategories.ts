import { Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

export const PIZZACATEGORY_TABLE_NAME = 'pizza_categories';

@Entity({name: PIZZACATEGORY_TABLE_NAME})
export default class PizzaCategories {
    @PrimaryGeneratedColumn({type: "bigint"})
    id: number;

    @Column()
    name: string;

    @Column({default: ""})
    description: string;
}