import {Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn} from 'typeorm';
import Pizza from "@root/entity/Pizza";
import Ingredient from "@root/entity/PizzaIngredient";

export const PIZZAINGREDIENT_TABLE_NAME = 'pizza_ingredients';

@Entity({name: PIZZAINGREDIENT_TABLE_NAME})
export default class PizzaIngredient {
    @PrimaryGeneratedColumn({type: "bigint"})
    id: number;

    @ManyToOne(() => Pizza, { onDelete: "CASCADE" })
    @JoinColumn({name: 'pizzaId'})
    pizza: Pizza;

    @ManyToOne(() => Ingredient, { onDelete: "CASCADE" })
    @JoinColumn({name: 'ingredientId'})
    ingredient: Ingredient;
}
