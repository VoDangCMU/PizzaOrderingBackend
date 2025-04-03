import {Request, Response} from "express";
import {AppDataSource} from "@root/data-source";
import PizzaSize from "@root/entity/PizzaSize";
import {z} from "zod";
import Number from "@root/schemas/Number";
import {extractErrorsFromZod} from "@root/utils";

const PizzaSizeRepository = AppDataSource.getRepository(PizzaSize);

const PizzaIdSchema = z.object({
	id: Number
})

export default async function getAllSizeOfPizza(req: Request, res: Response) {
	let parsedPizzaData;

	try {
		parsedPizzaData = PizzaIdSchema.parse({id: req.params.pizzaId});
	} catch (e) {
		return res.BadRequest(extractErrorsFromZod(e))
	}

	const pizzaId = parsedPizzaData.id;

	try {
		if (!(await PizzaSizeRepository.exists({
			where: {pizza: {id: pizzaId}},
			relations: {pizza: true}
		}))) return res.NotFound([{message: `Pizza with id ${pizzaId} not found.`}])
		
		const allSizeOfPizza = await PizzaSizeRepository.find({where: {pizza: {id: pizzaId}}, relations: {pizza: true}});

		return res.Ok(allSizeOfPizza);
	} catch (e) {
		return res.InternalServerError(e);
	}
}