import express from "express";
import createPizzaIngredient from "@root/routes/pizza-ingredient/createPizzaIngredient";
import getPizzaIngredient from "@root/routes/pizza-ingredient/getPizzaIngredient";
import updatePizzaIngredient from "@root/routes/pizza-ingredient/updatePizzaIngredient";
import deletePizzaIngredient from "@root/routes/pizza-ingredient/deletePizzaIngredient";
import getAllPizzaIngredients from "@root/routes/pizza-ingredient/getAllPizzaIngredients";

const pizzaIngredient = express.Router();
pizzaIngredient.post("/create", createPizzaIngredient);
pizzaIngredient.get("/get-by-id/:id", getPizzaIngredient);
pizzaIngredient.get("/get-all", getAllPizzaIngredients);
pizzaIngredient.put("/update/", updatePizzaIngredient);
pizzaIngredient.delete("/delete/:id", deletePizzaIngredient);

module.exports = pizzaIngredient;


