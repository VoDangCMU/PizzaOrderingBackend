import {Router} from "express";
import getIngredient from "@root/routes/ingredient/getIngredient";
import createIngredient from "@root/routes/ingredient/createIngredient";
import deleteIngredient from "@root/routes/ingredient/deleteIngredient";
import updateIngredient from "@root/routes/ingredient/updateIngredient";
import getAllIngredients from "@root/routes/ingredient/getAllIngredients";
import getIngredientByName from "@root/routes/ingredient/getIngredientByName";

const ingredient = Router();

ingredient.get("/getByID/:id", getIngredient);
ingredient.get("/getByName", getIngredientByName);
ingredient.get("/", getAllIngredients);
ingredient.post("/", createIngredient);
ingredient.delete("/:id", deleteIngredient);
ingredient.put("/", updateIngredient);

module.exports = ingredient;