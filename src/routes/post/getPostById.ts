import { Request, Response } from "express";
import { z } from "zod";
import logger from "@root/logger";
import { extractErrorsFromZod } from "@root/utils";
import { AppDataSource } from "@root/data-source";
import NUMBER from "@root/schemas/Number";
import Post from "@root/entity/Post";

const PostRepository = AppDataSource.getRepository(Post);

const PostIdSchema = z.object({
    id: NUMBER,
});

export default async function getPostById(req: Request, res: Response) {
    const parsed = PostIdSchema.safeParse({id: req.params.id});
    if (parsed.error) {
        logger.warn(parsed.error);
        return res.BadRequest(extractErrorsFromZod(parsed.error));
    }

    const postId = parsed.data.id;

    let post;

    try {
        post = await PostRepository.findOne({
            where: {
                id: postId
            }
        });
    } catch (e) {
        return res.InternalServerError(e);
    }

    if (!post) {
        return res.NotFound([{ message: `Post with id ${postId} not found` }]);
    }

    return res.Ok(post);
}