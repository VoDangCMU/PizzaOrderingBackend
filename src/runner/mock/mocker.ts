import {AppDataSource} from "@root/data-source";
import PizzaCategories from "@root/entity/PizzaCategories";
import path from "path";
import fs from "fs";
import {faker} from "@faker-js/faker";
import Ingredients from "@root/entity/Ingredients";
import Pizza from "@root/entity/Pizza";
import {IOrder, IPizza} from "@root/runner/mock/types";
import PizzaSize from "@root/entity/PizzaSize";
import PizzaIngredient from "@root/entity/PizzaIngredient";
import Users from "@root/entity/Users";
import bcrypt from "bcrypt";
import env from "@root/env";
import Order from "@root/entity/Order";
import OrderItem from "@root/entity/OrderItem";
import moment from "moment";
import PizzaImages from "@root/entity/PizzaImages";

const CategoriesRepository = AppDataSource.getRepository(PizzaCategories);
const IngredientRepository = AppDataSource.getRepository(Ingredients);
const PizzaRepository = AppDataSource.getRepository(Pizza);
const PizzaSizeRepository = AppDataSource.getRepository(PizzaSize);
const PizzaIngredientRepository = AppDataSource.getRepository(PizzaIngredient);
const UserRepository = AppDataSource.getRepository(Users);
const OrderRepository = AppDataSource.getRepository(Order);
const OrderItemRepository = AppDataSource.getRepository(OrderItem);
const PizzaImageRepository = AppDataSource.getRepository(PizzaImages);

const basePath = path.join(__dirname, "temp");

export function generateUser() {
	return {
		username: faker.internet.username() + new Date().getTime().toString(),
		password: bcrypt.hashSync(faker.internet.password(), env.BCRYPT_HASH_ROUND),
		dateOfBirth: faker.date.birthdate(),
		firstName: faker.person.firstName(),
		lastName: faker.person.lastName(),
		phone: faker.phone.number(),
		email: new Date().getTime().toString() + "@gmail.com",
		address: faker.location.streetAddress(),
	}
}

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
		let existedPizza;
		if (!(await PizzaRepository.exists({where: {name: pizza.name}}))) {
			const createdPizza = new Pizza();

			createdPizza.name = pizza.name;
			createdPizza.description = faker.food.description();
			createdPizza.category = (await CategoriesRepository.findOne({where: {name: pizza.category}}))!

			existedPizza = await PizzaRepository.save(createdPizza);
		}

		if (!existedPizza) existedPizza = (await PizzaRepository.findOne({where: {name: pizza.name}}))!;

		for (const [key, value] of Object.entries(pizza.sizes)) {
			const createdPizzaSize = new PizzaSize();

			createdPizzaSize.size = key;
			createdPizzaSize.price = value;
			createdPizzaSize.pizza = existedPizza;

			await PizzaSizeRepository.save(createdPizzaSize);
		}

		for (const ingredient of pizza.ingredients) {
			const createdPizzaIngredient = new PizzaIngredient();

			createdPizzaIngredient.pizza = existedPizza;
			createdPizzaIngredient.ingredient = (await IngredientRepository.findOne({where: {name: ingredient}}))!

			await PizzaIngredientRepository.save(createdPizzaIngredient);
		}

		const createdPizzaImage = new PizzaImages();

		createdPizzaImage.pizza = existedPizza;
		createdPizzaImage.src = `https://pizzas.khoav4.com/${existedPizza.name}.png`
		createdPizzaImage.alt = existedPizza.name

		await PizzaImageRepository.save(createdPizzaImage);
	}
}

export async function mockOrders() {
	const data: Array<IOrder> = JSON.parse(fs.readFileSync(path.join(basePath, "orders.json"), "utf8"));

	for (const order of data) {
		const userData = generateUser();
		const createdUser = new Users();
		const createdOrder = new Order();

		Object.assign(createdUser, userData);

		await UserRepository.save(createdUser);

		createdOrder.user = createdUser;
		createdOrder.createdAt = moment(`${order.items[0].order_date} ${order.items[0].order_time}`, "DD/MM/YYYY HH:mm:ss").toDate();

		await OrderRepository.save(createdOrder);

		for (const item of order.items) {
			const createdOrderItem = new OrderItem();

			createdOrderItem.order = createdOrder;
			createdOrderItem.pizza = (await PizzaRepository.findOne({where: {name: item.pizza_name}}))!;
			createdOrderItem.quantity = item.quantity;
			createdOrderItem.size = (await PizzaSizeRepository.findOne({where: {size: item.pizza_size, pizza: {name: item.pizza_name}}}))!
			createdOrderItem.createdAt = moment(`${item.order_date} ${item.order_time}`, "DD/MM/YYYY HH:mm:ss").toDate();

			await OrderItemRepository.save(createdOrderItem);
		}
	}
}