import { Router } from "express";
import { signup, signin, verify } from "../controllers/auth.controller.js";
import { validateLogin, validateSignup } from "../middleware/authValidation.js";
import { checkMail } from "../middleware/checkExsistMail.js";

const authRouter = Router();
authRouter.post("/auth/signup", validateSignup, checkMail, signup);
authRouter.post("/auth/signin", validateLogin, signin);
authRouter.get(
  "/auth/verify/:email",
  async (req, res) => await verify(req, res)
);

export default authRouter;
