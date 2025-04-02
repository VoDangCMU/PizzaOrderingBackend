import {Router} from "express";
import createPizza from "@root/routes/pizza/createPizza";
import getPizza from "@root/routes/pizza/getPizza";
import deletePizza from "@root/routes/pizza/deletePizza";
import updatePizza from "@root/routes/pizza/updatePizza";
import getAllPizzas from "@root/routes/pizza/getAllPizzas";
import getPizzaByName from "@root/routes/pizza/getPizzaByName";

const pizza = Router();

pizza.get("/get-by-id/:id", getPizza);
pizza.get("/get-by-name/:name", getPizzaByName);
pizza.get("/get-all", getAllPizzas);
pizza.post("/create", createPizza);
pizza.delete("/delete/:id", deletePizza);
pizza.put("/update", updatePizza);

module.exports = pizza;