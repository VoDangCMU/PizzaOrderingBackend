import getPizzaSizeByID from "@root/routes/pizza-size/getPizzaSizeByID";
import getAllPizzaSize from "@root/routes/pizza-size/getAllPizzaSize";
import getAllSizeOfPizza from "@root/routes/pizza-size/getAllSizeOfPizza";
import createPizzaSize from "@root/routes/pizza-size/createPizzaSize";
import updatePizzaSize from "@root/routes/pizza-size/updatePizzaSize";
import deletePizzaSize from "@root/routes/pizza-size/deletePizzaSize";
import {Router} from "express";
import isAuth from "@root/middlewares/isAuth";
import isAdmin from "@root/middlewares/isAdmin";

const pizzaSizeRouter = Router();

pizzaSizeRouter.get('/get-by-id/:id', getPizzaSizeByID)
pizzaSizeRouter.get('/get-all', getAllPizzaSize)
pizzaSizeRouter.get('/get-all-pizza-size/:pizzaId', getAllSizeOfPizza)
pizzaSizeRouter.post('/create', isAuth, isAdmin, createPizzaSize)
pizzaSizeRouter.put('/update', isAuth, isAdmin, updatePizzaSize)
pizzaSizeRouter.delete('/delete/:id', isAuth, isAdmin, deletePizzaSize)

module.exports = pizzaSizeRouter;