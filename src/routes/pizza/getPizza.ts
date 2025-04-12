import {Request, Response} from "express";
import {z} from "zod";
import logger from "@root/logger";
import {extractErrorsFromZod} from "@root/utils";
import {AppDataSource} from "@root/data-source";
import Pizza from "@root/entity/Pizza";

const PizzaRepository = AppDataSource.getRepository(Pizza);

export default async function (req: Request, res: Response) {
	const _id = req.params.id;

	let parsed;

	try {
		parsed = z.string().regex(/^\d+$/).transform(Number).parse(_id);
	} catch (e) {
		logger.warn(e);
		res.BadRequest(extractErrorsFromZod(e));
		return;
	}

	try {
		const id = parsed!;

		const pizza = await PizzaRepository.findOne({
			where: {id},
			relations: {sizes: true, category: true, extras: true, crusts: true, images: true}
		});

		if (!pizza) {
			res.NotFound([{message: "Pizza not found"}]);
			return;
		}

		res.Ok(pizza);
	} catch (e) {
		logger.error(e);
		res.InternalServerError({});
	}

}