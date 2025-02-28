import {Router} from "express";
import getPizzaCategory from "@root/routes/pizza-category/getPizzaCategory";
import {createPizzaCategory} from "@root/routes/pizza-category/createPizzaCategory";
import deletePizzaCategory from "@root/routes/pizza-category/deletePizzaCategory";
import updatePizzaCategory from "@root/routes/pizza-category/updatePizzaCategory";

const pizzaCategory = Router();

pizzaCategory.get("/:id", getPizzaCategory);
pizzaCategory.post("/", createPizzaCategory);
pizzaCategory.delete("/:id", deletePizzaCategory);
pizzaCategory.put("/", updatePizzaCategory);

module.exports = pizzaCategory;