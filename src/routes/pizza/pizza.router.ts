import {Router} from "express";
import createPizza from "@root/routes/pizza/createPizza";
import getPizza from "@root/routes/pizza/getPizza";
import deletePizza from "@root/routes/pizza/deletePizza";
import updatePizza from "@root/routes/pizza/updatePizza";

const pizza = Router();

pizza.get("/:id", getPizza);
pizza.post("/", createPizza);
pizza.delete("/:id", deletePizza);
pizza.put("/", updatePizza);

module.exports = pizza;