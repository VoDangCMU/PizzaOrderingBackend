import {Router} from "express";
import getCart from "@root/routes/cart/getCart";
import isAuth from "@root/middlewares/isAuth";
import createCart from "@root/routes/cart/createCart";

const cart = Router();

cart.get("/:id", isAuth, getCart);
cart.post("/", isAuth, createCart);
// cart.delete("/:id", deleteIngredient);
// cart.put("/", updateIngredient);

module.exports = cart;