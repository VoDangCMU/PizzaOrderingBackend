import {Router} from "express";
import getIngredient from "@root/routes/ingredient/getIngredient";
import createIngredient from "@root/routes/ingredient/createIngredient";
import deleteIngredient from "@root/routes/ingredient/deleteIngredient";
import updateIngredient from "@root/routes/ingredient/updateIngredient";

const ingredient = Router();

ingredient.get("/:id", getIngredient);
ingredient.post("/", createIngredient);
ingredient.delete("/:id", deleteIngredient);
ingredient.put("/", updateIngredient);

module.exports = ingredient;