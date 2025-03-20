import express from 'express';
import createPizzaCrust from "@root/routes/pizza-crust/createPizzaCrust";
import getPizzaCrustById from "@root/routes/pizza-crust/getPizzaCrustById";
import deletePizzaCrustById from "@root/routes/pizza-crust/deletePizzaCrustById";
import isAuth from "@root/middlewares/isAuth";
import updatePizzaCrustById from "@root/routes/pizza-crust/updatePizzaCrustById";
import getAllPizzaCrusts from "@root/routes/pizza-crust/getAllPizzaCrusts";

const pizzaCrust = express.Router();

pizzaCrust.post("/",isAuth, createPizzaCrust);
pizzaCrust.get("/:id",isAuth, getPizzaCrustById);
pizzaCrust.get("/", isAuth, getAllPizzaCrusts);
pizzaCrust.put("/:id", isAuth, updatePizzaCrustById);
pizzaCrust.delete("/:id", isAuth, deletePizzaCrustById);

module.exports = pizzaCrust;