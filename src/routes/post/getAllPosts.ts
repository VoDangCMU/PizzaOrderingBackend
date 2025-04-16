import {Request, Response} from "express";
import {AppDataSource} from "@root/data-source";
import Post from "@root/entity/Post";

const PostRepository = AppDataSource.getRepository(Post);

export default async function getAllPosts(req: Request, res: Response) {
    try {
        const allPosts = await PostRepository.find();

        return res.Ok(allPosts);
    } catch (e) {
        return res.InternalServerError(e)
    }
}