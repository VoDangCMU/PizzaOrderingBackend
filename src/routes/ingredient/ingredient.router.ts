import {Router} from "express";
import getIngredient from "@root/routes/ingredient/getIngredient";
import createIngredient from "@root/routes/ingredient/createIngredient";
import deleteIngredient from "@root/routes/ingredient/deleteIngredient";
import updateIngredient from "@root/routes/ingredient/updateIngredient";
import isAuth from "@root/middlewares/isAuth";
import getAllIngredients from "@root/routes/ingredient/getAllIngredients";

const ingredient = Router();

ingredient.get("/:id", getIngredient);
ingredient.get("/", isAuth, getAllIngredients);
ingredient.post("/", createIngredient);
ingredient.delete("/:id", deleteIngredient);
ingredient.put("/", updateIngredient);

module.exports = ingredient;