import express from "express";
import {
  createOrder,
  getOrders,
  getAllOrders,
  updateDeliverStatus,
} from "../controllers/order.controller.js";

import { tokenVerify } from "../middleware/tokenVerify.js";

const orderRoutes = express.Router();
orderRoutes.use(tokenVerify)
// CREATE ORDER [TOKEN]
orderRoutes.post( "/orders", tokenVerify, createOrder );


// UPDATE ORDER DELIVERY
orderRoutes.put("/orders/seller/update", updateDeliverStatus);


// READ ORDER: CHECK ROLE : USER => ORDER | (SELLER OR ADMIN) => ORDER
orderRoutes.get("/orders/",tokenVerify, getOrders);


// READ ALL ORDERS
orderRoutes.get("/orders/admin", getAllOrders);


export default orderRoutes
