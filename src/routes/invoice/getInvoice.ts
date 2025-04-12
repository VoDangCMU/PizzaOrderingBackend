import { Request, Response } from 'express';
import {AppDataSource} from "@root/data-source";
import Invoice from "@root/entity/Invoice";
import {z} from "zod";
import logger from "@root/logger";
import NUMBER from "@root/schemas/Number";
import {extractErrorsFromZod} from "@root/utils";

const InvoiceIdSchema = z.object({
    id: NUMBER
})

const InvoiceRepository = AppDataSource.getRepository(Invoice);

export default function getInvoice (req: Request, res: Response) {
    const parsed = InvoiceIdSchema.safeParse({id: req.params.id});
    if(parsed.error) {
        logger.warn(parsed.error);
        return res.BadRequest(extractErrorsFromZod(parsed.error));
    }

    const invoiceId = parsed.data.id;
    let invoice;

    try {
        invoice = InvoiceRepository.findOne({
            where: {id: invoiceId}
        })
    } catch (e) {
        res.InternalServerError(e);
    }
    if (!invoice) {
        return res.NotFound([{ message: `Invoice with id ${invoiceId} not found` }]);
    }

    return res.Ok(invoice);
}