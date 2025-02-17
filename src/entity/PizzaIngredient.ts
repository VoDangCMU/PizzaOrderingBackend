import {Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import Pizza from "@root/entity/Pizza";
import Ingredient from "@root/entity/PizzaIngredient";

export const PIZZA_INGREDIENT_TABLE_NAME = 'pizza_ingredients';

@Entity({name: PIZZA_INGREDIENT_TABLE_NAME})
export default class PizzaIngredient {
    @PrimaryGeneratedColumn({type: "bigint"})
    id: number;

    @ManyToOne(() => Pizza, {onDelete: "CASCADE"})
    pizza: Pizza;

    @ManyToOne(() => Ingredient, {onDelete: "CASCADE"})
    ingredient: Ingredient;
}
