import {Router} from "express";
import createPizza from "@root/routes/pizza/createPizza";
import getPizza from "@root/routes/pizza/getPizza";
import deletePizza from "@root/routes/pizza/deletePizza";
import updatePizza from "@root/routes/pizza/updatePizza";
import getAllPizzas from "@root/routes/pizza/getAllPizzas";
import isAuth from "@root/middlewares/isAuth";
import getPizzaByName from "@root/routes/pizza/getPizzaByName";
import isAdmin from "@root/middlewares/isAdmin";

const pizza = Router();

pizza.get("/getByID/:id", getPizza);
pizza.get("/getByName", getPizzaByName);
pizza.get("/", isAuth, isAdmin, getAllPizzas);
pizza.post("/", createPizza);
pizza.delete("/:id", deletePizza);
pizza.put("/", updatePizza);

module.exports = pizza;