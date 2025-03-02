import {Request, Response} from 'express';
import {z} from 'zod';
import {AppDataSource} from "@root/data-source";
import Invoice from "@root/entity/Invoice";
import Users from "@root/entity/Users";
import Cart from "@root/entity/Cart";
import {extractErrorsFromZod} from "@root/utils";
import logger from "@root/logger";

const UpdateInvoiceSchema = z.object({
    price: z.number(),
    paid: z.union([z.string(), z.boolean()]).transform((val) => val === "true" || val === true),
})

const InvoiceRepository = AppDataSource.getRepository(Invoice);
const UserRepository = AppDataSource.getRepository(Users);
const CartRepository = AppDataSource.getRepository(Cart);

export default async function updateInvoice(req: Request, res: Response) {
    const invoiceId = req.params.id;
    const body = req.body;
    const userId = req.body.userId;
    const cartId = req.body.cartId;

    try {
        const parsedInvoiceId = z.string().regex(/^\d+$/).transform(Number).safeParse(invoiceId);
        if (parsedInvoiceId.error) {
            res.BadRequest(extractErrorsFromZod(parsedInvoiceId.error));
            return;
        }

        const parsedBody = UpdateInvoiceSchema.safeParse(body);

        if (parsedBody.error) {
            res.BadRequest(parsedBody.error);
            return;
        }
        const invoiceBody = parsedBody.data;

        const parsedUserId = z.union([z.string().regex(/^\d+$/), z.number()]).transform(Number).safeParse(userId);
        const parsedCartId = z.union([z.string().regex(/^\d+$/), z.number()]).transform(Number).safeParse(cartId);

        if (parsedUserId.error) {
            res.BadRequest(extractErrorsFromZod(parsedUserId));
            return;
        }

        if (parsedCartId.error) {
            res.BadRequest(extractErrorsFromZod(parsedCartId));
            return;
        }

        const existedInvoice = await InvoiceRepository.findOne({
            where: {
                id: parsedInvoiceId.data
            }
        })
        if(!existedInvoice) {
            res.NotFound("Invoice not found");
            return;
        }

        const existedUser = await UserRepository.findOne({
            where: {
                id: parsedUserId.data
            }
        })
        if (!existedUser) {
            res.NotFound("User not found");
            return;
        }

        const existedCart = await CartRepository.findOne({
            where: {
                id: parsedCartId.data
            }
        })
        if (!existedCart) {
            res.NotFound("Cart not found");
            return;
        }

        existedInvoice.user = existedUser;
        existedInvoice.cart = existedCart;
        existedInvoice.price = invoiceBody.price;
        existedInvoice.paid = invoiceBody.paid;

        await InvoiceRepository.save(existedInvoice);

        res.Ok(existedInvoice);
    }
    catch (err) {
        logger.error(err);
    }
}