import { Request, Response } from "express";
import logger from "@root/logger";
import { extractErrorsFromZod } from "@root/utils";
import { z } from "zod";
import { AppDataSource } from "@root/data-source";
import Number from "@root/schemas/Number";
import Post from "@root/entity/Post";

const PostRepository = AppDataSource.getRepository(Post);

const UpdatePostParams = z.object({
    id: Number,
    title: z.string(),
    body: z.string(),
});

export default async function updatePostById(req: Request, res: Response) {
    const parsed = UpdatePostParams.safeParse(req.body);
    if (parsed.error) {
        logger.warn(parsed.error);
        return res.BadRequest(extractErrorsFromZod(parsed.error));
    }

    const postData = parsed.data;

    let post;

    try {
        post = await PostRepository.findOne({
            where: {
                id: postData.id
            }
        });
    } catch (e) {
        return res.InternalServerError(e);
    }

    if (!post) {
        return res.NotFound([{ message: `Post with id ${postData.id} not found` }]);
    }

    post.title = postData.title;
    post.body = postData.body;

    try {
        await PostRepository.save(post);
    } catch (e) {
        return res.InternalServerError(e);
    }

    return res.Ok(post);
}
