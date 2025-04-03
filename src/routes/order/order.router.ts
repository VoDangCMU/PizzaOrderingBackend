import {Router} from "express";
import getOrder from "@root/routes/order/getOrder";
import isAuth from "@root/middlewares/isAuth";
import createOrder from "@root/routes/order/createOrder";
import removeItemFromOrder from "@root/routes/order/removeItemFromOrder";
import addItemToOrder from "@root/routes/order/addItemToOrder";
import updateOrderItem from "@root/routes/order/updateOrderItem";
import getAllOrder from "@root/routes/order/getAllOrder";
import getAllOrderItems from "@root/routes/order/getAllOrderItems";
import isAdmin from "@root/middlewares/isAdmin";

const cart = Router();

cart.get("/get-by-id/:id", isAuth, getOrder);
cart.get("/get-all", isAuth, isAdmin, getAllOrder);
cart.get("/get-all-order-items/", isAuth, isAdmin, getAllOrderItems);
cart.post("/create", isAuth, createOrder);
cart.post("/add-item", isAuth, addItemToOrder);
cart.delete("/delete-item/:id", isAuth, removeItemFromOrder);
cart.put("/update-item/", isAuth, updateOrderItem);

module.exports = cart;