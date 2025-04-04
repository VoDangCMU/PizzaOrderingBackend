import {Request, Response} from "express";
import {AppDataSource} from "@root/data-source";
import PizzaSize from "@root/entity/PizzaSize";

const PizzaSizeRepository = AppDataSource.getRepository(PizzaSize);

export default async function getAllPizzaSize(req: Request, res: Response) {
	try {
		const allPizzaSize = await PizzaSizeRepository.find({relations: {pizza: true}})

		return res.Ok(allPizzaSize);
	} catch (e) {
		return res.InternalServerError(e)
	}
}