import {extractAll} from "@root/runner/mock/extract_formated_data";
import {mockCategories, mockIngredients, mockPizza} from "@root/runner/mock/mocker";
import {AppDataSource} from "@root/data-source";
import logger from "@root/logger";

(async () => {
	logger.info('Initializing datasource...');
	await AppDataSource.initialize();
	logger.info('Extract data from dataset...');
	await extractAll();
	logger.info('Mocking...');
	logger.info('Mocking Categories...');
	await mockCategories();
	logger.info('Mocking Ingredients...');
	await mockIngredients();
	logger.info('Mocking Pizzas...');
	await mockPizza();
})()