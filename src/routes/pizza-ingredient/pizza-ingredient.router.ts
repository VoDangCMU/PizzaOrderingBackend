import express from "express";
import createPizzaIngredient from "@root/routes/pizza-ingredient/createPizzaIngredient";
import getPizzaIngredient from "@root/routes/pizza-ingredient/getPizzaIngredient";
import updatePizzaIngredient from "@root/routes/pizza-ingredient/updatePizzaIngredient";
import deletePizzaIngredient from "@root/routes/pizza-ingredient/deletePizzaIngredient";
import getAllPizzaIngredients from "@root/routes/pizza-ingredient/getAllPizzaIngredients";
import isAuth from "@root/middlewares/isAuth";
import isAdmin from "@root/middlewares/isAdmin";


const pizzaIngredient = express.Router();
pizzaIngredient.post("/", createPizzaIngredient);
pizzaIngredient.get("/:id", getPizzaIngredient);
pizzaIngredient.get("/", isAuth, isAdmin, getAllPizzaIngredients);
pizzaIngredient.put("/:id", updatePizzaIngredient);
pizzaIngredient.delete("/:id", deletePizzaIngredient);

module.exports = pizzaIngredient;


