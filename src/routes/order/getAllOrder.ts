import {Request, Response} from 'express';
import {AppDataSource} from "@root/data-source";
import Order from "@root/entity/Order";
import logger from "@root/logger";
import {z} from "zod";
import {extractErrorsFromZod} from "@root/utils";

const OrderRepository = AppDataSource.getRepository(Order);

const PageSizeSchema = z.object({pageSize: z.number().multipleOf(25).max(100).optional().default(25)});
const PageSchema = z.object({page: z.number().optional().default(1)});

export default async function getAllOrder(req: Request, res: Response) {
  let _pageSize, _page;

  try {
    _pageSize = PageSizeSchema.parse({pageSize: Number(req.query.pageSize)});
    _page = PageSchema.parse({page: Number(req.query.page)});
  } catch (error) {
    logger.warn(error);
    return res.BadRequest(extractErrorsFromZod(error))
  }

  try {
    const [carts, count] = await OrderRepository.findAndCount({
      relations: {user: true, orderItems: {pizza: true, crust: true, outerCrust: true, extra: true, size: true}},
      take: _pageSize.pageSize, skip: ((_page.page - 1) * _pageSize.pageSize)
    });

    res.Ok({
      carts,
      page: _page.page,
      pageSize: _pageSize.pageSize,
      totalPage: Math.ceil(count / _pageSize.pageSize),
    });
  } catch (error) {
    logger.error(error);
    res.InternalServerError({});
  }
}