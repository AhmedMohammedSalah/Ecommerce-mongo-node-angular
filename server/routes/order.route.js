import express from "express"
import { createOrder } from "../controllers/order.controller.js";

const orderRoutes = express.Router();



// CREATE ORDER [TOKEN]
orderRoutes.post('/orders/', createOrder);

export default orderRoutes
