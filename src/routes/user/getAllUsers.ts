import {Request, Response} from 'express';
import {AppDataSource} from "@root/data-source";
import Users from "@root/entity/Users";
import {z} from "zod";
import logger from "@root/logger";
import {extractErrorsFromZod} from "@root/utils";

const UserRepository = AppDataSource.getRepository(Users);

const PageSizeSchema = z.object({pageSize: z.number().multipleOf(25).max(100).optional().default(25)});
const PageSchema = z.object({page: z.number().optional().default(1)});

export default async function getAllUsers (req: Request, res: Response) {
    let _pageSize, _page;

    try {
        _pageSize = PageSizeSchema.parse({pageSize: Number(req.query.pageSize)});
        _page = PageSchema.parse({page: Number(req.query.page)});
    } catch (error) {
        logger.warn(error);
        return res.BadRequest(extractErrorsFromZod(error))
    }
    try {
        const [users, count] = await UserRepository.findAndCount({take: _pageSize.pageSize, skip: ((_page.page - 1) * _pageSize.pageSize)});
        res.Ok({
            users: users,
            page: _page.page,
            pageSize: _pageSize.pageSize,
            totalPage: Math.ceil(count / _pageSize.pageSize),
        });
    } catch(error) {
        res.InternalServerError(error);
    }
}