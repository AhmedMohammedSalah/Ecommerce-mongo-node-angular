import express from "express";
import { adminSignUp, adminSignIn } from "../controllers/admin.controller.js";

const adminRouter = express.Router();

adminRouter.post("/admin/signup", adminSignUp);
adminRouter.post("/admin/signin", adminSignIn);

export default adminRouter;