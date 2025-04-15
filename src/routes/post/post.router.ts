import express from "express";
import createPost from "@root/routes/post/createPost";
import isAuth from "@root/middlewares/isAuth";
import getPostById from "@root/routes/post/getPostById";
import getAllPosts from "@root/routes/post/getAllPosts";
import updatePostById from "@root/routes/post/updatePostById";
import deletePost from "@root/routes/post/deletePost";

const post = express.Router();

post.post("/create", isAuth, createPost);
post.get("/get-by-id/:id", getPostById);
post.get("/get-all", getAllPosts);
post.put("/update", isAuth, updatePostById);
post.delete("/delete/:id", isAuth, deletePost);

module.exports = post;