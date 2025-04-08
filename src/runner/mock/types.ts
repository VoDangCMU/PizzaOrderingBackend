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

export interface IPizza {
  name: string;
  sizes: {
    [key: string]: number;
  },
  category: string;
  ingredients: Array<string>;
}