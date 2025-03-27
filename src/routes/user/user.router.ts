import express from "express";
import getUserById from "@root/routes/user/getUserById";
import updateUserById from "@root/routes/user/updateUserById";
import deleteUserById from "@root/routes/user/deleteUserById";
import isAuth from "@root/middlewares/isAuth";
import isAdmin from "@root/middlewares/isAdmin";
import getAllUsers from "@root/routes/user/getAllUsers";

const user = express.Router();

user.get("/get-by-id/:id", getUserById);
user.get("/get-all", isAuth, isAdmin, getAllUsers);
user.put("/update/", isAuth, updateUserById);
user.delete("/delete/:id", isAuth, deleteUserById);

module.exports = user;
