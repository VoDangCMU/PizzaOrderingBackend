import {Request, Response} from "express";
import {z} from "zod";
import Number from "@root/schemas/Number";
import * as _PizzaSize from "@root/schemas/PizzaSize";
import {AppDataSource} from "@root/data-source";
import PizzaSize from "@root/entity/PizzaSize";
import {extractErrorsFromZod} from "@root/utils";

const PizzaSizeRepository = AppDataSource.getRepository(PizzaSize);

const CreatePizzaSizeSchema = z.object({
	pizzaId: Number,
	size: _PizzaSize.default,
	price: Number,
})

export default function createPizzaSize(req: Request, res: Response) {
	let pizzaSizeData, existedPizzaSize;

	try {
		pizzaSizeData = CreatePizzaSizeSchema.parse(req.body);
	} catch (e) {
		return res.BadRequest(extractErrorsFromZod(e));
	}

	try {
		existedPizzaSize
	} catch (e) {

	}
}