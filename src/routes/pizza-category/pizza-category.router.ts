import {Router} from "express";
import getPizzaCategory from "@root/routes/pizza-category/getPizzaCategory";
import {createPizzaCategory} from "@root/routes/pizza-category/createPizzaCategory";
import deletePizzaCategory from "@root/routes/pizza-category/deletePizzaCategory";
import updatePizzaCategory from "@root/routes/pizza-category/updatePizzaCategory";
import isAuth from "@root/middlewares/isAuth";
import getAllPizzaCategories from "@root/routes/pizza-category/getAllPizzaCategories";
import isAdmin from "@root/middlewares/isAdmin";
import {getPizzaCategoryByName} from "@root/routes/pizza-category/getPizzaCategoryByName";

const pizzaCategory = Router();

pizzaCategory.get("/getByID/:id", getPizzaCategory);
pizzaCategory.get("/getByName", getPizzaCategoryByName);
pizzaCategory.get("/", isAuth, isAdmin, getAllPizzaCategories);
pizzaCategory.post("/", createPizzaCategory);
pizzaCategory.delete("/:id", deletePizzaCategory);
pizzaCategory.put("/", updatePizzaCategory);

module.exports = pizzaCategory;