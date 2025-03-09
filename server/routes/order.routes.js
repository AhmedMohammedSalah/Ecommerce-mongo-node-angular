import express from "express"
import { createOrder, updateDeliverStatus } from "../controllers/order.controller.js";

const orderRoutes = express.Router();



// CREATE ORDER [TOKEN]
orderRoutes.post('/orders/', createOrder);

// UPDATE ORDER DELIVERY
orderRoutes.post("/orders/seller/update", updateDeliverStatus);

export default orderRoutes
