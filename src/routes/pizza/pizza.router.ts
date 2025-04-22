import {Router} from "express";
import createPizza from "@root/routes/pizza/createPizza";
import getPizza from "@root/routes/pizza/getPizza";
import deletePizza from "@root/routes/pizza/deletePizza";
import updatePizza from "@root/routes/pizza/updatePizza";
import getAllPizzas from "@root/routes/pizza/getAllPizzas";
import getPizzaByName from "@root/routes/pizza/getPizzaByName";
import isAuth from "@root/middlewares/isAuth";
import isAdmin from "@root/middlewares/isAdmin";
import getPizzaByPizzaNameID from "@root/routes/pizza/getPizzaByPizzaNameID";

const pizza = Router();

pizza.get("/get-by-id/:id", getPizza);
pizza.get("/get-by-name/:name", getPizzaByName);
pizza.get("/get-by-name-id/:pizzaNameID", getPizzaByPizzaNameID)
pizza.get("/get-all", getAllPizzas);
pizza.post("/create", isAuth, isAdmin, createPizza);
pizza.delete("/delete/:id", isAuth, isAdmin, deletePizza);
pizza.put("/update", isAuth, isAdmin, updatePizza);

module.exports = pizza;