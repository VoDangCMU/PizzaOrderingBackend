import moment from "moment/moment";
import {IPizzaData, IRawPizzaData, TPizzaSize} from "@root/runner/mock";

export function transformRawData(data: IRawPizzaData): IPizzaData {
  return {
    pizza_id: parseInt(data.pizza_id, 10),
    order_id: parseInt(data.order_id, 10),
    pizza_name_id: data.pizza_name_id,
    quantity: parseInt(data.quantity, 10),
    order_date: moment(data.order_date.split(/[/-]/).reverse().map(e => e.length < 2 ? '0'.concat(e) : e).join('-').concat('T00:00:00.000Z')).format('DD/MM/yyyy'),
    order_time: data.order_time,
    unit_price: parseFloat(data.unit_price),
    total_price: parseFloat(data.total_price),
    pizza_size: data.pizza_size as TPizzaSize,
    pizza_category: data.pizza_category,
    pizza_ingredients: data.pizza_ingredients.split(', ').map(e => e),
    pizza_name: data.pizza_name
  }
}