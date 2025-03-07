import { Router } from "express";

const customerRouter = Router();
import { updateCustomer } from "../controllers/customer.controller.js";

// update customer
customerRouter.put("/update/:index", updateCustomer);

export default customerRouter;