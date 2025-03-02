import { Request, Response } from 'express';
import {AppDataSource} from "@root/data-source";
import Invoice from "@root/entity/Invoice";
import {z} from "zod";
import logger from "@root/logger";

const InvoiceSchema = z.object({
    id: z.union([z.string().regex(/^\d+$/), z.number()]).transform(Number)
})

const InvoiceRepository = AppDataSource.getRepository(Invoice);

export default function getInvoice (req: Request, res: Response) {
    const invoiceId = req.params.id;
    const parsedId = InvoiceSchema.safeParse({id: invoiceId});

    if (parsedId.error) {
        res.BadRequest(parsedId.error);
        return;
    }

    const invoiceIdParsed = parsedId.data.id;

    InvoiceRepository.findOne({
        where: {
            id: invoiceIdParsed
        }
    })
        .then(invoice => {
            if (!invoice) {
                res.NotFound("Invoice not found");
                return;
            }
            res.Ok(invoice);
        })
        .catch(err => {
            logger.error(err);
        })

}