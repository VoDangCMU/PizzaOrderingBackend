import {Router} from "express";
import createPizza from "@root/routes/pizza/createPizza";
import getPizza from "@root/routes/pizza/getPizza";
import deletePizza from "@root/routes/pizza/deletePizza";
import updatePizza from "@root/routes/pizza/updatePizza";
import getAllPizzas from "@root/routes/pizza/getAllPizzas";
import isAuth from "@root/middlewares/isAuth";
import getPizzaByName from "@root/routes/pizza/getPizzaByName";

const pizza = Router();

pizza.get("/:id", getPizza);
pizza.get("/", getPizzaByName);
pizza.get("/",isAuth, getAllPizzas);
pizza.post("/", createPizza);
pizza.delete("/:id", deletePizza);
pizza.put("/", updatePizza);

module.exports = pizza;