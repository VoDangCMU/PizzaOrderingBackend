import {Router} from "express";
import getPizzaOuterCrustById from "@root/routes/pizza-outer-crust/getPizzaOuterCrustById";
import isAuth from "@root/middlewares/isAuth";
import getAllPizzaOuterCrusts from "@root/routes/pizza-outer-crust/getAllPizzaOuterCrusts";
import updatePizzaOuterCrustById from "@root/routes/pizza-outer-crust/updatePizzaOuterCrustById";
import createPizzaOuterCrust from "@root/routes/pizza-outer-crust/createPizzaOuterCrust";
import deletePizzaOuterCrust from "@root/routes/pizza-outer-crust/deletePizzaOuterCrust";
import isAdmin from "@root/middlewares/isAdmin";

const pizzaOuterCrust = Router();

pizzaOuterCrust.post("/", isAuth, createPizzaOuterCrust);
pizzaOuterCrust.get("/:id", isAuth, getPizzaOuterCrustById);
pizzaOuterCrust.get("/", isAuth, isAdmin, getAllPizzaOuterCrusts);
pizzaOuterCrust.put("/:id", isAuth, updatePizzaOuterCrustById);
pizzaOuterCrust.delete("/:id", isAuth, deletePizzaOuterCrust);

module.exports = pizzaOuterCrust;