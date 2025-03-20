import {Router} from "express";
import createPizzaExtra from "@root/routes/pizza-extra/createPizzaExtra";
import getPizzaExtra from "@root/routes/pizza-extra/getPizzaExtra";
import updatePizzaExtra from "@root/routes/pizza-extra/updatePizzaExtra";
import deletePizzaExtra from "@root/routes/pizza-extra/deletePizzaExtra";
import isAuth from "@root/middlewares/isAuth";
import getAllPizzaExtras from "@root/routes/pizza-extra/getAllPizzaExtras";

const pizzaExtra = Router();

pizzaExtra.post("/", createPizzaExtra)
pizzaExtra.get("/:id", getPizzaExtra)
pizzaExtra.get("/", isAuth, getAllPizzaExtras);
pizzaExtra.put("/:id", isAuth, updatePizzaExtra)
pizzaExtra.delete("/:id", isAuth, deletePizzaExtra)

module.exports = pizzaExtra;