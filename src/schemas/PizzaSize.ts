import {z} from "zod";

const PIZZA_SIZE = z.enum(['S', 'M', 'L', 'XL', 'XXL']);

export default PIZZA_SIZE;