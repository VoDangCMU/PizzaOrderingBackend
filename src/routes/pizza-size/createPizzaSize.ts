import {Request, Response} from "express";
import {z} from "zod";
import Number from "@root/schemas/Number";
import * as _PizzaSize from "@root/schemas/PizzaSize";
import {AppDataSource} from "@root/data-source";
import PizzaSize from "@root/entity/PizzaSize";
import {extractErrorsFromZod} from "@root/utils";
import Pizza from "@root/entity/Pizza";

const PizzaSizeRepository = AppDataSource.getRepository(PizzaSize);
const PizzaRepository = AppDataSource.getRepository(Pizza);

const CreatePizzaSizeSchema = z.object({
	pizzaId: Number,
	size: _PizzaSize.default,
	price: Number,
})

export default async function createPizzaSize(req: Request, res: Response) {
	let pizzaSizeData, existedPizzaSize, existedPizza;

	try {
		pizzaSizeData = CreatePizzaSizeSchema.parse(req.body);
	} catch (e) {
		return res.BadRequest(extractErrorsFromZod(e));
	}

	try {
		existedPizzaSize = await PizzaSizeRepository.findOne({
			where: {size: pizzaSizeData.size, pizza: {id: pizzaSizeData.pizzaId}},
			relations: {pizza: true}
		})

		existedPizza = await PizzaRepository.findOne({
			where: {id: pizzaSizeData.pizzaId},
		})
	} catch (e) {
		return res.InternalServerError(e);
	}

	if (existedPizzaSize) return res.BadRequest([{message: `Pizza Size ${pizzaSizeData.size} of Pizza ${pizzaSizeData.pizzaId} already existed.`}])
	if (!existedPizza) return res.NotFound([{message: `Pizza with id ${pizzaSizeData.pizzaId} not found.`}])

	const pizzaSize = new PizzaSize();

	Object.assign(pizzaSize, pizzaSizeData);
	pizzaSize.pizza = existedPizza;

	pizzaSize.pizzaNameID = "vd_" + existedPizza.name.toLowerCase().split(" ").join("_").concat("_").concat(pizzaSizeData.size.toLowerCase());

	try {
		await PizzaSizeRepository.save(pizzaSize);
	} catch (e) {
		return res.InternalServerError(e);
	}

	return res.Ok(pizzaSize);
}