import * as path from 'path';
import * as fs from 'fs';
import csv from 'csv-parser';
import logger from "@root/logger";
import {AppDataSource} from "@root/data-source";
import PizzaCategories from "@root/entity/PizzaCategories";
import {faker} from "@faker-js/faker";
import bcrypt from "bcrypt";
import env from "@root/env";
import Pizza from "@root/entity/Pizza";
import Ingredients from "@root/entity/Ingredients";
import PizzaIngredient from "@root/entity/PizzaIngredient";
import PizzaSize from "@root/entity/PizzaSize";
import Order from "@root/entity/Order";
import Users from "@root/entity/Users";
import OrderItem from "@root/entity/OrderItem";
import moment from "moment";
import {sleep} from "@root/utils";

const PizzaCategoryRepository = AppDataSource.getRepository(PizzaCategories);
const PizzaRepository = AppDataSource.getRepository(Pizza);
const IngredientRepository = AppDataSource.getRepository(Ingredients);
const PizzaIngredientRepository = AppDataSource.getRepository(PizzaIngredient);
const PizzaSizeRepository = AppDataSource.getRepository(PizzaSize);
const CartRepository = AppDataSource.getRepository(Order);
const UserRepository = AppDataSource.getRepository(Users);
const CartItemRepository = AppDataSource.getRepository(OrderItem);

logger.info(`Running in ${env.ENV} environment`)
AppDataSource.initialize()
	.then(async () => {
		await mockAll();
	})
	.catch((err: any) => {
		console.error(err);
	});


const csvDataFilePath = path.join(__dirname, 'pizza_sales.csv');

export type TPizzaSize = 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'XXXL';

export interface IOrder {
	[key: string]: Array<IPizzaData>
}

export interface IRawPizzaData {
	pizza_id: string;
	order_id: string;
	pizza_name_id: string;
	quantity: string;
	order_date: string;
	order_time: string;
	unit_price: string;
	total_price: string;
	pizza_size: string;
	pizza_category: string;
	pizza_ingredients: string;
	pizza_name: string;
}

export interface IPizzaData {
	pizza_id: number;
	order_id: number;
	pizza_name_id: string;
	quantity: number;
	order_date: string;
	order_time: string;
	unit_price: number;
	total_price: number;
	pizza_size: TPizzaSize;
	pizza_category: string;
	pizza_ingredients: Array<string>;
	pizza_name: string;
}

const Categories: Array<string> = [
	'Classic',
	'Veggie',
	'Supreme',
	'Chicken'
]
const PizzaList = [
	{
		pizza_name: "The Hawaiian Pizza",
		unit_price: 13.25,
		pizza_ingredients: ["Sliced Ham", "Pineapple", "Mozzarella Cheese"],
		pizza_category: "Classic"
	},
	{
		pizza_name: "The Classic Deluxe Pizza",
		unit_price: 16,
		pizza_ingredients: ["Pepperoni", "Mushrooms", "Red Onions", "Red Peppers", "Bacon"],
		pizza_category: "Classic"
	},
	{
		pizza_name: "The Five Cheese Pizza",
		unit_price: 18.5,
		pizza_ingredients: ["Mozzarella Cheese", "Provolone Cheese", "Smoked Gouda Cheese", "Romano Cheese", "Blue Cheese", "Garlic"],
		pizza_category: "Veggie"
	},
	{
		pizza_name: "The Italian Supreme Pizza",
		unit_price: 20.75,
		pizza_ingredients: ["Calabrese Salami", "Capocollo", "Tomatoes", "Red Onions", "Green Olives", "Garlic"],
		pizza_category: "Supreme"
	},
	{
		pizza_name: "The Mexicana Pizza",
		unit_price: 16,
		pizza_ingredients: ["Tomatoes", "Red Peppers", "Jalapeno Peppers", "Red Onions", "Cilantro", "Corn", "Chipotle Sauce", "Garlic"],
		pizza_category: "Veggie"
	},
	{
		pizza_name: "The Thai Chicken Pizza",
		unit_price: 20.75,
		pizza_ingredients: ["Chicken", "Pineapple", "Tomatoes", "Red Peppers", "Thai Sweet Chilli Sauce"],
		pizza_category: "Chicken"
	},
	{
		pizza_name: "The Prosciutto and Arugula Pizza",
		unit_price: 20.75,
		pizza_ingredients: ["Prosciutto di San Daniele", "Arugula", "Mozzarella Cheese"],
		pizza_category: "Supreme"
	},
	{
		pizza_name: "The Barbecue Chicken Pizza",
		unit_price: 12.75,
		pizza_ingredients: ["Barbecued Chicken", "Red Peppers", "Green Peppers", "Tomatoes", "Red Onions", "Barbecue Sauce"],
		pizza_category: "Chicken"
	},
	{
		pizza_name: "The Greek Pizza",
		unit_price: 12,
		pizza_ingredients: ["Kalamata Olives", "Feta Cheese", "Tomatoes", "Garlic", "Beef Chuck Roast", "Red Onions"],
		pizza_category: "Classic"
	},
	{
		pizza_name: "The Spinach Supreme Pizza",
		unit_price: 12.5,
		pizza_ingredients: ["Spinach", "Red Onions", "Pepperoni", "Tomatoes", "Artichokes", "Kalamata Olives", "Garlic", "Asiago Cheese"],
		pizza_category: "Supreme"
	},
	{
		pizza_name: "The Green Garden Pizza",
		unit_price: 12,
		pizza_ingredients: ["Spinach", "Mushrooms", "Tomatoes", "Green Olives", "Feta Cheese"],
		pizza_category: "Veggie"
	},
	{
		pizza_name: "The Italian Capocollo Pizza",
		unit_price: 20.5,
		pizza_ingredients: ["Capocollo", "Red Peppers", "Tomatoes", "Goat Cheese", "Garlic", "Oregano"],
		pizza_category: "Classic"
	},
	{
		pizza_name: "The Spicy Italian Pizza",
		unit_price: 20.75,
		pizza_ingredients: ["Capocollo", "Tomatoes", "Goat Cheese", "Artichokes", "Peperoncini verdi", "Garlic"],
		pizza_category: "Supreme"
	},
	{
		pizza_name: "The Spinach Pesto Pizza",
		unit_price: 20.75,
		pizza_ingredients: ["Spinach", "Artichokes", "Tomatoes", "Sun-dried Tomatoes", "Garlic", "Pesto Sauce"],
		pizza_category: "Veggie"
	},
	{
		pizza_name: "The Vegetables + Vegetables Pizza",
		unit_price: 12,
		pizza_ingredients: ["Mushrooms", "Tomatoes", "Red Peppers", "Green Peppers", "Red Onions", "Zucchini", "Spinach", "Garlic"],
		pizza_category: "Veggie"
	},
	{
		pizza_name: "The Southwest Chicken Pizza",
		unit_price: 20.75,
		pizza_ingredients: ["Chicken", "Tomatoes", "Red Peppers", "Red Onions", "Jalapeno Peppers", "Corn", "Cilantro", "Chipotle Sauce"],
		pizza_category: "Chicken"
	},
	{
		pizza_name: "The California Chicken Pizza",
		unit_price: 20.75,
		pizza_ingredients: ["Chicken", "Artichoke", "Spinach", "Garlic", "Jalapeno Peppers", "Fontina Cheese", "Gouda Cheese"],
		pizza_category: "Chicken"
	},
	{
		pizza_name: "The Pepperoni Pizza",
		unit_price: 15.25,
		pizza_ingredients: ["Mozzarella Cheese", "Pepperoni"],
		pizza_category: "Classic"
	},
	{
		pizza_name: "The Chicken Pesto Pizza",
		unit_price: 20.75,
		pizza_ingredients: ["Chicken", "Tomatoes", "Red Peppers", "Spinach", "Garlic", "Pesto Sauce"],
		pizza_category: "Chicken"
	},
	{
		pizza_name: "The Big Meat Pizza",
		unit_price: 12,
		pizza_ingredients: ["Bacon", "Pepperoni", "Italian Sausage", "Chorizo Sausage"],
		pizza_category: "Classic"
	},
	{
		pizza_name: "The Soppressata Pizza",
		unit_price: 20.75,
		pizza_ingredients: ["Soppressata Salami", "Fontina Cheese", "Mozzarella Cheese", "Mushrooms", "Garlic"],
		pizza_category: "Supreme"
	},
	{
		pizza_name: "The Four Cheese Pizza",
		unit_price: 17.95,
		pizza_ingredients: ["Ricotta Cheese", "Gorgonzola Piccante Cheese", "Mozzarella Cheese", "Parmigiano Reggiano Cheese", "Garlic"],
		pizza_category: "Veggie"
	},
	{
		pizza_name: "The Napolitana Pizza",
		unit_price: 12,
		pizza_ingredients: ["Tomatoes", "Anchovies", "Green Olives", "Red Onions", "Garlic"],
		pizza_category: "Classic"
	},
	{
		pizza_name: "The Calabrese Pizza",
		unit_price: 16.25,
		pizza_ingredients: ["?duja Salami", "Pancetta", "Tomatoes", "Red Onions", "Friggitello Peppers", "Garlic"],
		pizza_category: "Supreme"
	},
	{
		pizza_name: "The Italian Vegetables Pizza",
		unit_price: 12.75,
		pizza_ingredients: ["Eggplant", "Artichokes", "Tomatoes", "Zucchini", "Red Peppers", "Garlic", "Pesto Sauce"],
		pizza_category: "Veggie"
	},
	{
		pizza_name: "The Mediterranean Pizza",
		unit_price: 16,
		pizza_ingredients: ["Spinach", "Artichokes", "Kalamata Olives", "Sun-dried Tomatoes", "Feta Cheese", "Plum Tomatoes", "Red Onions"],
		pizza_category: "Veggie"
	},
	{
		pizza_name: "The Pepper Salami Pizza",
		unit_price: 12.5,
		pizza_ingredients: ["Genoa Salami", "Capocollo", "Pepperoni", "Tomatoes", "Asiago Cheese", "Garlic"],
		pizza_category: "Supreme"
	},
	{
		pizza_name: "The Spinach and Feta Pizza",
		unit_price: 20.25,
		pizza_ingredients: ["Spinach", "Mushrooms", "Red Onions", "Feta Cheese", "Garlic"],
		pizza_category: "Veggie"
	},
	{
		pizza_name: "The Sicilian Pizza",
		unit_price: 20.25,
		pizza_ingredients: ["Coarse Sicilian Salami", "Tomatoes", "Green Olives", "Luganega Sausage", "Onions", "Garlic"],
		pizza_category: "Supreme"
	},
	{
		pizza_name: "The Chicken Alfredo Pizza",
		unit_price: 12.75,
		pizza_ingredients: ["Chicken", "Red Onions", "Red Peppers", "Mushrooms", "Asiago Cheese", "Alfredo Sauce"],
		pizza_category: "Chicken"
	},
	{
		pizza_name: "The Pepperoni, Mushroom, and Peppers Pizza",
		unit_price: 17.5,
		pizza_ingredients: ["Pepperoni", "Mushrooms", "Green Peppers"],
		pizza_category: "Classic"
	},
	{
		pizza_name: "The Brie Carre Pizza",
		unit_price: 23.65,
		pizza_ingredients: ["Brie Carre Cheese", "Prosciutto", "Caramelized Onions", "Pears", "Thyme", "Garlic"],
		pizza_category: "Supreme"
	}
];

export function transformRawData(data: IRawPizzaData): IPizzaData {
	return {
		pizza_id: parseInt(data.pizza_id, 10),
		order_id: parseInt(data.order_id, 10),
		pizza_name_id: data.pizza_name_id,
		quantity: parseInt(data.quantity, 10),
		order_date: moment(data.order_date).format('DD/MM/yyyy'),
		order_time: data.order_time,
		unit_price: parseInt(data.unit_price, 10),
		total_price: parseInt(data.total_price, 10),
		pizza_size: data.pizza_size as TPizzaSize,
		pizza_category: data.pizza_category,
		pizza_ingredients: data.pizza_ingredients.split(', ').map(e => e),
		pizza_name: data.pizza_name
	}
}

export default function generateUserData() {
	return {
		username: faker.internet.username(),
		password: bcrypt.hashSync(faker.internet.password(), env.BCRYPT_HASH_ROUND),
		dateOfBirth: faker.date.birthdate(),
		firstName: faker.person.firstName(),
		lastName: faker.person.lastName(),
		phone: faker.phone.number(),
		email: faker.internet.email(),
		address: faker.location.streetAddress(),
	}
}

export async function createPizzaCategory() {
	for (let _category of Categories) {
		const category = new PizzaCategories();

		category.name = _category;
		category.description = faker.food.description();

		await PizzaCategoryRepository.upsert(category, {
			conflictPaths: {name: true},
			skipUpdateIfNoValuesChanged: true
		})
	}
}

export async function createPizza() {
	for (let _pizza of PizzaList) {
		const pizza = new Pizza();

		const category = await PizzaCategoryRepository.findOne({
			where: {name: _pizza.pizza_category}
		})

		pizza.category = category!;
		pizza.name = _pizza.pizza_name;
		pizza.description = faker.food.description();
		pizza.unitPrice = _pizza.unit_price;

		await PizzaRepository.upsert(pizza, {
			conflictPaths: {name: true},
			skipUpdateIfNoValuesChanged: true
		})

		for (let _ingredient of _pizza.pizza_ingredients) {
			const ingredient = await createIngredient(_ingredient)

			await createPizzaIngredient(pizza, ingredient)
		}

		for (let _size of ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'] as Array<TPizzaSize>) {
			await createPizzaSize(pizza, _size)
		}
	}
}

async function createPizzaSize(pizza: Pizza, size: TPizzaSize) {
	const pizzaSize = (await PizzaSizeRepository.findOne({where: {size, pizza: {id: pizza.id}}})) || new PizzaSize();

	pizzaSize.size = size;
	pizzaSize.pizza = pizza;

	await PizzaSizeRepository.save(pizzaSize)

	return pizzaSize;
}

async function createIngredient(name: string) {
	const ingredient = (await IngredientRepository.findOne({where: {name}})) || new Ingredients();

	ingredient.name = name;
	ingredient.description = faker.food.description();
	ingredient.image = faker.image.url();

	await IngredientRepository.save(ingredient)

	return ingredient;
}

async function createPizzaIngredient(pizza: Pizza, ingredient: Ingredients) {
	const pizzaIngredient = (await PizzaIngredientRepository.findOne({
		where: {
			ingredient: {id: ingredient.id},
			pizza: {id: pizza.id}
		}
	})) || new PizzaIngredient();

	pizzaIngredient.ingredient = ingredient;
	pizzaIngredient.pizza = pizza;

	await PizzaIngredientRepository.save(pizzaIngredient)

	return pizzaIngredient;
}

async function createCart(user: Users) {
	const cart = (await CartRepository.findOne({where: {user: {id: user.id}}})) || new Order();

	cart.user = user;

	await CartRepository.insert(cart);

	return cart;
}

async function createUser() {
	const user = new Users();
	const mockedUser = generateUserData();

	user.username = mockedUser.username;
	user.email = mockedUser.email;
	user.address = mockedUser.address;
	user.phone = mockedUser.phone;
	user.password = mockedUser.password;
	user.firstName = mockedUser.firstName;
	user.lastName = mockedUser.lastName;
	user.dateOfBirth = mockedUser.dateOfBirth;

	await UserRepository.insert(user);

	return user;
}

async function createCartItem(cart: Order, pizzaData: IPizzaData) {
	const cartItem = new OrderItem();
	const existedPizza = (await PizzaRepository.findOne({where: {name: pizzaData.pizza_name}}))!

	cartItem.order = cart;
	cartItem.pizza = existedPizza;
	cartItem.quantity = pizzaData.quantity;
	cartItem.size = (await PizzaSizeRepository.findOne({
		where: {
			pizza: {id: existedPizza.id},
			size: pizzaData.pizza_size
		}
	}))!;
	logger.debug(moment(`${pizzaData.order_date} ${pizzaData.order_time}`).toDate())
	cartItem.createdAt = moment(`${pizzaData.order_date} ${pizzaData.order_time}`).toDate();

	await CartItemRepository.insert(cartItem);

	return cartItem;
}

async function groupByOrderID(): Promise<IOrder> {
	const orderData: IOrder = {}
	return new Promise((resolve, reject) => {
		fs.createReadStream(csvDataFilePath)
			.pipe(csv())
			.on('data', async (data: IRawPizzaData) => {
				const pizzaData = transformRawData(data);

				orderData[pizzaData.order_id] ? orderData[pizzaData.order_id].push(pizzaData) : orderData[pizzaData.order_id] = [pizzaData];
			})
			.on('end', async () => {
				resolve(orderData)
			});
	})
}

export async function mockAll() {
	const data = await groupByOrderID();

	await createPizzaCategory();
	await createPizza();
	for (const [key, value] of Object.entries(data)) {
		logger.info("Current data", key, value);

		const user = await createUser();
		const cart = await createCart(user);

		value.forEach((item) => createCartItem(cart, item))
		await sleep(50);
	}
}




