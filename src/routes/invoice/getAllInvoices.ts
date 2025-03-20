import {Request, Response} from 'express';
import {AppDataSource} from "@root/data-source";
import Invoice from "@root/entity/Invoice";
import logger from "@root/logger";

const InvoiceRepository = AppDataSource.getRepository(Invoice);

export default async function getAllInvoices(req: Request, res: Response) {
    try {
        const invoices = await InvoiceRepository.find({});

        res.Ok(invoices);
    } catch(error) {
        logger.error(error);
        res.InternalServerError({});
    }
}
