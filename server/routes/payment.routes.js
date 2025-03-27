import { Router } from "express";
import { tokenVerify } from "../middleware/tokenVerify.js";
import {
  createPayment,
  executePaypal,
  getAllPayments,
  getPayment,
} from "../controllers/payment.controller.js";

export const paymentRouter = new Router();

paymentRouter.use(tokenVerify);
paymentRouter.post("/pay", createPayment);
paymentRouter.get("/pay/:id", getPayment);
paymentRouter.get("/all-payments", getAllPayments);
paymentRouter.post("/execute", executePaypal);
