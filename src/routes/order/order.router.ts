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

const orderRouter = Router();

orderRouter.get("/get-by-id/:id", isAuth, getOrder);
orderRouter.get("/get-all", isAuth, isAdmin, getAllOrder);
orderRouter.get("/get-all-order-items/", isAuth, isAdmin, getAllOrderItems);
orderRouter.post("/create", isAuth, createOrder);
orderRouter.post("/add-item", isAuth, addItemToOrder);
orderRouter.delete("/delete-item/:id", isAuth, removeItemFromOrder);
orderRouter.put("/update-item/", isAuth, updateOrderItem);

module.exports = orderRouter;