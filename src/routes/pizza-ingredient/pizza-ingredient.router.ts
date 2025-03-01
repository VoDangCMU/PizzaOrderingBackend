import express from "express";
import createPizzaIngredient from "@root/routes/pizza-ingredient/createPizzaIngredient";
import getPizzaIngredient from "@root/routes/pizza-ingredient/getPizzaIngredient";
import updatePizzaIngredient from "@root/routes/pizza-ingredient/updatePizzaIngredient";
import deletePizzaIngredient from "@root/routes/pizza-ingredient/deletePizzaIngredient";


const pizzaIngredient = express.Router();
pizzaIngredient.post("/", createPizzaIngredient);
pizzaIngredient.get("/:id", getPizzaIngredient);
pizzaIngredient.put("/:id", updatePizzaIngredient);
pizzaIngredient.delete("/:id", deletePizzaIngredient);

module.exports = pizzaIngredient;


