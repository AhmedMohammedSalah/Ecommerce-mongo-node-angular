import { Router } from "express";
const authRouter = Router();
import { signup, signin } from "../controllers/auth.controller.js";

authRouter.post("/auth/signup", signup);
authRouter.post("/auth/signin", signin);

export default authRouter;