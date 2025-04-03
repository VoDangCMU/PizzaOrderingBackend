import {Router, Request, Response} from "express";
import getPizzaSizeByID from "@root/routes/pizza-size/getPizzaSizeByID";
import getAllPizzaSize from "@root/routes/pizza-size/getAllPizzaSize";
import getAllSizeOfPizza from "@root/routes/pizza-size/getAllSizeOfPizza";

const pizzaSizeRouter = Router();

pizzaSizeRouter.get('/get-by-id/:id', getPizzaSizeByID)
pizzaSizeRouter.get('/get-all', getAllPizzaSize)
pizzaSizeRouter.get('/get-all-pizza-size/:pizzaId', getAllSizeOfPizza)
pizzaSizeRouter.post('/create', async (req: Request, res: Response) => {})
pizzaSizeRouter.put('/update', async (req: Request, res: Response) => {})
pizzaSizeRouter.delete('/delete/:id', async (req: Request, res: Response) => {})

module.exports = pizzaSizeRouter;