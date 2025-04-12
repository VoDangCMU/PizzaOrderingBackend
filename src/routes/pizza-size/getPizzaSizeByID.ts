import {Request, Response} from "express";
import Number from "@root/schemas/Number";
import {z} from "zod";
import {extractErrorsFromZod} from "@root/utils";
import {AppDataSource} from "@root/data-source";
import PizzaSize from "@root/entity/PizzaSize";

const PizzaSizeRepository = AppDataSource.getRepository(PizzaSize);

const PizzaSizeIDSchema = z.object({
	id: Number
})

export default async function getPizzaSizeByID(req: Request, res: Response) {
	let parsedData;

	try {
		parsedData = PizzaSizeIDSchema.parse({id: req.params.id});
	} catch (e) {
		return res.BadRequest(extractErrorsFromZod(e));
	}

	const id = parsedData.id;

	try {
		const pizzaSize = await PizzaSizeRepository.findOne({
			where: {id},
			relations: {pizza: true}
		})

		if (!pizzaSize) return res.NotFound([{message: `Pizza Size with id ${id} not found.`}])

		return res.Ok(pizzaSize);
	} catch (e) {
		return res.InternalServerError(e);
	}
}