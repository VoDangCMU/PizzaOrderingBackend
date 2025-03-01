import {Request, Response} from 'express';
import {z} from 'zod';
import {AppDataSource} from "@root/data-source";
import Invoice from "@root/entity/Invoice";
import Users from "@root/entity/Users";
import Cart from "@root/entity/Cart";
import {extractErrorsFromZod} from "@root/utils";
import logger from "@root/logger";

const CreateInvoiceSchema = z.object({
    price: z.number(),
    paid: z.union([z.string(), z.boolean()]).transform((val) => val === "true" || val === true),
    createdAt: z.union([z.string(), z.date()]).transform((val) => new Date(val)),
    updatedAt: z.union([z.string(), z.date()]).transform((val) => new Date(val))
})

const InvoiceRepository = AppDataSource.getRepository(Invoice);
const UserRepository = AppDataSource.getRepository(Users);
const CartRepository = AppDataSource.getRepository(Cart);

export default async function createInvoice(req: Request, res: Response) {
    const body = req.body;
    const userId = req.body.userId;
    const cartId = req.body.cartId;

    try {
        const parsedBody = CreateInvoiceSchema.safeParse(body);
        if (parsedBody.error) {
            res.BadRequest(parsedBody.error);
            return;
        }
        const invoice = parsedBody.data;

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

        const existedInvoice = await InvoiceRepository.findOne({
            where: {
                user: {id: parsedUserId.data},
                cart: {id: parsedCartId.data}
            }
        })
        if(existedInvoice) {
            res.BadRequest([{message: "Invoice already exists", detail: existedInvoice}]);
            return;
        }

        const createdInvoice = new Invoice();

        createdInvoice.user = existedUser;
        createdInvoice.cart = existedCart;
        createdInvoice.price = invoice.price;
        createdInvoice.paid = invoice.paid;
        createdInvoice.createdAt = invoice.createdAt;
        createdInvoice.updatedAt = invoice.updatedAt;

        await InvoiceRepository.save(createdInvoice);

        res.Ok(createdInvoice);
    }
    catch (err) {
        logger.error(err);
    }
}