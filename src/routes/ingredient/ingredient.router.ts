import {Router} from "express";
import getIngredient from "@root/routes/ingredient/getIngredient";
import createIngredient from "@root/routes/ingredient/createIngredient";
import deleteIngredient from "@root/routes/ingredient/deleteIngredient";
import updateIngredient from "@root/routes/ingredient/updateIngredient";
import getAllIngredients from "@root/routes/ingredient/getAllIngredients";
import getIngredientByName from "@root/routes/ingredient/getIngredientByName";

const ingredient = Router();

ingredient.get("/get-by-id/:id", getIngredient);
ingredient.get("/get-by-name/:name", getIngredientByName);
ingredient.get("/get-all", getAllIngredients);
ingredient.post("/create/", createIngredient);
ingredient.delete("/delete/:id", deleteIngredient);
ingredient.put("/update", updateIngredient);

module.exports = ingredient;