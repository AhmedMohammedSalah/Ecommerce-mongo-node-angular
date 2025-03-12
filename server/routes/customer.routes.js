import { Router } from "express";

const customerRouter = Router();
import { updateCustomer } from "../controllers/customer.controller.js";

// update customer
customerRouter.put("/customer/update-profile", updateCustomer);

export default customerRouter;