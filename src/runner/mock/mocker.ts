import {AppDataSource} from "@root/data-source";
import PizzaCategories from "@root/entity/PizzaCategories";
import path from "path";
import fs from "fs";
import {faker} from "@faker-js/faker";
import Ingredients from "@root/entity/Ingredients";
import Pizza from "@root/entity/Pizza";
import {IPizza} from "@root/runner/mock/types";
import PizzaSize from "@root/entity/PizzaSize";
import PizzaIngredient from "@root/entity/PizzaIngredient";

const CategoriesRepository = AppDataSource.getRepository(PizzaCategories);
const IngredientRepository = AppDataSource.getRepository(Ingredients);
const PizzaRepository = AppDataSource.getRepository(Pizza);
const PizzaSizeRepository = AppDataSource.getRepository(PizzaSize);
const PizzaIngredientRepository = AppDataSource.getRepository(PizzaIngredient);

const basePath = path.join(__dirname, "temp");

export async function mockCategories() {
	const data: Array<string> = JSON.parse(fs.readFileSync(path.join(basePath, "categories.json"), "utf8"));

	for (const category of data) {
		if (!(await CategoriesRepository.exists({where: {name: category}}))) {
			const createdCategory = new PizzaCategories();

			createdCategory.name = category;
			createdCategory.description = faker.food.description();

			await CategoriesRepository.save(createdCategory);
		}
	}
}

export async function mockIngredients() {
	const data: Array<string> = JSON.parse(fs.readFileSync(path.join(basePath, "ingredients.json"), "utf8"));

	for (const ingredient of data) {
		if (!(await IngredientRepository.exists({where: {name: ingredient}}))) {
			const createdIngredient = new Ingredients();

			createdIngredient.name = ingredient;
			createdIngredient.description = faker.food.description();

			await IngredientRepository.save(createdIngredient);
		}
	}
}

export async function mockPizza() {
	const data: Array<IPizza> = JSON.parse(fs.readFileSync(path.join(basePath, "pizzas.json"), "utf8"));

	for (const pizza of data) {
		if (!(await PizzaRepository.exists({where: {name: pizza.name}}))) {
			const createdPizza = new Pizza();

			createdPizza.name = pizza.name;
			createdPizza.description = faker.food.description();
			createdPizza.category = (await CategoriesRepository.findOne({where: {name: pizza.category}}))!

			await PizzaRepository.save(createdPizza);

			for (const [key, value] of Object.entries(pizza.sizes)) {
				const createdPizzaSize = new PizzaSize();

				createdPizzaSize.size = key;
				createdPizzaSize.price = value;
				createdPizzaSize.pizza = createdPizza;

				await PizzaSizeRepository.save(createdPizzaSize);
			}

			for (const ingredient of pizza.ingredients) {
				const createdPizzaIngredient = new PizzaIngredient();

				createdPizzaIngredient.pizza = createdPizza;
				createdPizzaIngredient.ingredient = (await IngredientRepository.findOne({where: {name: ingredient}}))!

				await PizzaIngredientRepository.save(createdPizzaIngredient);
			}
		}
	}
}