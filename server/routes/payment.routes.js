import {Router} from 'express'
import { tokenVerify } from "../middleware/tokenVerify.js";
import { createPayment, getAllPayments, getPayment } from '../controllers/payment.controller.js';


export const paymentRouter = new Router();

paymentRouter.use( tokenVerify );
paymentRouter.post("/pay", createPayment);
paymentRouter.get("/pay/:id", getPayment);
paymentRouter.get("/all-payments", getAllPayments);