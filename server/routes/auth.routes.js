import { Router } from "express";
const authRouter = Router();
import { signup, signin, verify } from "../controllers/auth.controller.js";
import { validateLogin, validateSignin } from "../middleware/authValidation.js";
import { checkMail } from "../middleware/checkExsistMail.js";

authRouter.post("/auth/signup", validateSignin, checkMail, signup);
authRouter.post("/auth/signin", validateLogin, signin);
authRouter.get(
  "/auth/verify/:email",
  async (req, res) => await verify(req, res)
);

export default authRouter;
