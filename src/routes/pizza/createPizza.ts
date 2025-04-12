import {Request, Response} from 'express';
import {z} from "zod";
import logger from "@root/logger";
import {extractErrorsFromZod} from "@root/utils";
import {AppDataSource} from "@root/data-source";
import Pizza from "@root/entity/Pizza";
import PizzaCategories from "@root/entity/PizzaCategories";

const CreatePizzaParamsSchema = z.object({
	name: z.string(),
	unitPrice: z.string().transform((val) => Number(`${val}`.replace(",", "."))).pipe(z.number()),
	categoryID: z.string().regex(/^\d+$/).transform(Number),
	description: z.string().optional().default(""),
})

const PizzaRepository = AppDataSource.getRepository(Pizza);
const PizzaCategoryRepository = AppDataSource.getRepository(PizzaCategories);

export default async function createPizza(req: Request, res: Response) {
	const body = req.body;
	let parsed;

	try {
		parsed = CreatePizzaParamsSchema.parse(body);
	} catch (e) {
		logger.warn(e);
		res.BadRequest(extractErrorsFromZod(e));
		return;
	}

	try {
		const pizza = parsed!;

		const existedPizza = await PizzaRepository.findOne({
			where: {name: pizza.name},
		})

		if (existedPizza) {
			res.BadRequest([{message: `Pizza with name ${pizza.name} exists`, detail: existedPizza}]);
			return;
		}

		const existedCategory = await PizzaCategoryRepository.findOne({
			where: {id: pizza.categoryID},
		})

		if (!existedCategory) {
			res.NotFound([{message: `Category with id ${pizza.categoryID} not found`}]);
			return;
		}

		const createdPizza = new Pizza();

		createdPizza.name = pizza.name;
		createdPizza.category = existedCategory;
		createdPizza.unitPrice = pizza.unitPrice;
		createdPizza.description = pizza.description;

		await PizzaRepository.save(createdPizza);

		res.Ok(createdPizza);
	} catch (e) {
		res.InternalServerError(e);
	}
}