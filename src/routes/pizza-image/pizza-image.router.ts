import express from 'express';
import createPizzaImage from "@root/routes/pizza-image/createPizzaImage";
import getPizzaImage from "@root/routes/pizza-image/getPizzaImage";
import deletePizzaImage from "@root/routes/pizza-image/deletePizzaImage";
import isAuth from "@root/middlewares/isAuth";
import updatePizzaImage from "@root/routes/pizza-image/updatePizzaImage";
import getAllPizzaImages from "@root/routes/pizza-image/getAllPizzaImages";

const pizzaImage = express.Router();

pizzaImage.post("/", createPizzaImage);
pizzaImage.get("/:id", getPizzaImage);
pizzaImage.get("/", isAuth, getAllPizzaImages);
pizzaImage.delete("/:id", isAuth, deletePizzaImage);
pizzaImage.put("/:id", isAuth, updatePizzaImage);

module.exports = pizzaImage;