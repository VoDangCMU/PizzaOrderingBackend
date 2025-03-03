import { Router } from 'express';
import createInvoice from "@root/routes/invoice/createInvoice";
import getInvoice from "@root/routes/invoice/getInvoice";
import updateInvoice from "@root/routes/invoice/updateInvoice";
import deleteInvoice from "@root/routes/invoice/deleteInvoice";


const invoice = Router();

invoice.post('/', createInvoice);
invoice.get('/:id', getInvoice);
invoice.put('/:id', updateInvoice);
invoice.delete('/:id', deleteInvoice);

module.exports = invoice;