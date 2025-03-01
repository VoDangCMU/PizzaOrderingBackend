import { Router } from 'express';
import createInvoice from "@root/routes/invoice/createInvoice";

const invoice = Router();

invoice.post('/', createInvoice);

module.exports = invoice;