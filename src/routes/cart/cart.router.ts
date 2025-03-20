import {Router} from "express";
import getCart from "@root/routes/cart/getCart";
import isAuth from "@root/middlewares/isAuth";
import createCart from "@root/routes/cart/createCart";
import removeItemFromCart from "@root/routes/cart/removeItemFromCart";
import addItemToCart from "@root/routes/cart/addItemToCart";
import updateCartItem from "@root/routes/cart/updateCartItem";
import getAllCarts from "@root/routes/cart/getAllCarts";
import getAllCartItems from "@root/routes/cart/getAllCartItems";

const cart = Router();

cart.get("/:id", isAuth, getCart);
cart.get("/", isAuth, getAllCarts);
cart.get("/items", isAuth, getAllCartItems);
cart.post("/", isAuth, createCart);
cart.post("/items/", isAuth, addItemToCart);
cart.delete("/items/:id", removeItemFromCart);
cart.put("/items/", isAuth, updateCartItem);

module.exports = cart;