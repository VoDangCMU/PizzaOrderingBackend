import { Request, Response } from "express";
import {z} from "zod";
import NUMBER from "@root/schemas/Number";
import logger from "@root/logger";
import {extractErrorsFromZod} from "@root/utils";
import {AppDataSource} from "@root/data-source";
import Users from "@root/entity/Users";
import Post from "@root/entity/Post";

const CreatePostSchema = z.object({
    userId: NUMBER,
    title: z.string(),
    body: z.string(),
})

const UserRepository = AppDataSource.getRepository(Users);
const PostRepository = AppDataSource.getRepository(Post);

export default async function createPost(req: Request, res: Response) {
    const parsed = CreatePostSchema.safeParse(req.body);
    if (parsed.error) {
        logger.warn(parsed.error);
        return res.BadRequest(extractErrorsFromZod(parsed.error));
    }

    const userId = parsed.data.userId;
    const title = parsed.data.title;
    const body = parsed.data.body;

    let author;

    try {
        author = await UserRepository.findOne({
            where: {
                id: userId
            }
        })
    } catch (e) {
        return res.InternalServerError(e);
    }

    if(!author) {
        return res.BadRequest([{message: `User with ID ${userId} not found`}]);
    }

    const createPost = new Post();
    createPost.title = title;
    createPost.body = body;
    createPost.user = author;

    try {
        await PostRepository.save(createPost);
    } catch (e) {
        return res.InternalServerError(e);
    }

    return res.Ok(createPost);
}