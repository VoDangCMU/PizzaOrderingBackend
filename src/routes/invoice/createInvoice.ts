import {Request, Response} from 'express';
import {z} from 'zod';
import {AppDataSource} from "@root/data-source";
import Invoice from "@root/entity/Invoice";
import Users from "@root/entity/Users";
import Order from "@root/entity/Order";
import {extractErrorsFromZod} from "@root/utils";
import logger from "@root/logger";
import NUMBER from "@root/schemas/Number";

const CreateInvoiceSchema = z.object({
    userId: NUMBER,
    orderId: NUMBER,
    price: NUMBER,
    paid: z.union([z.string(), z.boolean()]).transform((val) => val === "true" || val === true).default(false),
})

const InvoiceRepository = AppDataSource.getRepository(Invoice);
const UserRepository = AppDataSource.getRepository(Users);
const OrderRepository = AppDataSource.getRepository(Order);

export default async function createInvoice(req: Request, res: Response) {
    const parsed = CreateInvoiceSchema.safeParse(req.body);
    if (parsed.error) {
        logger.warn(parsed.error);
        res.BadRequest(extractErrorsFromZod(parsed.error));
        return;
    }

    const userId = parsed.data.userId;
    const orderId = parsed.data.orderId;
    const price = parsed.data.price;
    const paid = parsed.data.paid;

    let existedInvoice;
    let existedUser;
    let existedOrder;

    try {
        existedInvoice = await InvoiceRepository.findOne({
            where: {
                user: { id: userId },
                order: { id: orderId }
            }
        });
    } catch (e) {
        return res.InternalServerError(e);
    }
    if (existedInvoice) {
        return res.BadRequest([{message: `Invoice for User ID ${userId} and order ID ${orderId} already exists.`}]);
    }

    try {
        existedUser = await UserRepository.findOne({
            where: { id: userId }
        });
    } catch (e) {
        return res.InternalServerError(e);
    }
    if (!existedUser) {
        return res.NotFound([{ message: `User with ID ${userId} not found.` }]);
    }

    try {
        existedOrder = await OrderRepository.findOne({
            where: { id: orderId }
        });
    } catch (e) {
        return res.InternalServerError(e);
    }
    if (!existedOrder) {
        return res.NotFound([{ message: `Order with ID ${orderId} not found.` }]);
    }


    const createdInvoice = new Invoice();

    createdInvoice.user = existedUser;
    createdInvoice.order = existedOrder;
    createdInvoice.price = price;
    createdInvoice.paid = paid;

    try {
        await InvoiceRepository.save(createdInvoice);
    } catch (e) {
        return res.InternalServerError(e);
    }

    return res.Ok(createdInvoice);
}