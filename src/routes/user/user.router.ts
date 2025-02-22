import express from "express";
import {getUserById} from "@root/routes/user/getUserById";
import {updateUserById} from "@root/routes/user/updateUserById";
import {deleteUserById} from "@root/routes/user/deleteUserById";
import isAuth from "@root/middlewares/isAuth";

const user = express.Router();
user.get("/:id", isAuth, getUserById);
user.put("/:id", isAuth, updateUserById);
user.delete("/:id", isAuth, deleteUserById);
module.exports = user;
