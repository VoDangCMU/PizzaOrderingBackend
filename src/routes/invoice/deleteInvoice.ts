import {Request, Response} from 'express';
import {z} from "zod";
import {AppDataSource} from "@root/data-source";
import Invoice from "@root/entity/Invoice";
import logger from "@root/logger";

const DeleteInvoiceSchema = z.object({
    id: z.union([z.string().regex(/^\d+$/), z.number()]).transform(Number)
})

const InvoiceRepository = AppDataSource.getRepository(Invoice);

export default function deleteInvoice (req: Request, res: Response) {
    const invoiceId = req.params.id;
    const parsedId = DeleteInvoiceSchema.safeParse({id: invoiceId});

    if(parsedId.error) {
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

            InvoiceRepository.delete(invoiceIdParsed)
                .then(() => {
                    res.Ok(invoice);
                })
                .catch(err => {
                    logger.error(err);
                    res.InternalServerError({});
                })
        })
        .catch(err => {
            logger.error(err);
            res.InternalServerError({});
        })
}