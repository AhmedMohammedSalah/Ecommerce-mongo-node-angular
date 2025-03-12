import { Router } from "express";
const userRouter = Router();
import { auth, isAdmin } from "../middleware/authValidation.js";
import {
  getUser,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";
import { tokenVerify } from "../middleware/tokenVerify.js";
// [AMS] 🪪 using of verify token on all routes
 userRouter.use(tokenVerify);

userRouter.get("/users/:id", auth, isAdmin, getUser); // Only admins can read users
userRouter.patch("/users/:id", auth, updateUser); // Users can update their own profile
userRouter.delete("/users/:id", auth, isAdmin, deleteUser); // Only admins can delete users

export default userRouter;
