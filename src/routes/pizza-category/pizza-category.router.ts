import {Router} from "express";
import getPizzaCategory from "@root/routes/pizza-category/getPizzaCategory";
import {createPizzaCategory} from "@root/routes/pizza-category/createPizzaCategory";
import deletePizzaCategory from "@root/routes/pizza-category/deletePizzaCategory";
import updatePizzaCategory from "@root/routes/pizza-category/updatePizzaCategory";
import getAllPizzaCategories from "@root/routes/pizza-category/getAllPizzaCategories";
import {getPizzaCategoryByName} from "@root/routes/pizza-category/getPizzaCategoryByName";

const pizzaCategory = Router();

pizzaCategory.get("/get-by-id/:id", getPizzaCategory);
pizzaCategory.get("/get-by-name/:name", getPizzaCategoryByName);
pizzaCategory.get("/get-all", getAllPizzaCategories);
pizzaCategory.post("/create", createPizzaCategory);
pizzaCategory.delete("/delete/:id", deletePizzaCategory);
pizzaCategory.put("/update", updatePizzaCategory);

module.exports = pizzaCategory;