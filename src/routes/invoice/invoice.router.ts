import { Router } from 'express';
import createInvoice from "@root/routes/invoice/createInvoice";
import getInvoice from "@root/routes/invoice/getInvoice";
import updateInvoice from "@root/routes/invoice/updateInvoice";
import deleteInvoice from "@root/routes/invoice/deleteInvoice";
import getAllInvoices from "@root/routes/invoice/getAllInvoices";
import isAuth from "@root/middlewares/isAuth";
import isAdmin from "@root/middlewares/isAdmin";


const invoice = Router();

invoice.post('/create', createInvoice);
invoice.get('/get-by-id/:id', getInvoice);
invoice.get("/get-all", isAuth, isAdmin, getAllInvoices);
invoice.put('/update', updateInvoice);
invoice.delete('/delete/:id', deleteInvoice);

module.exports = invoice;