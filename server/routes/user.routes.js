import { Router } from "express";
const userRouter = Router();
import { auth, isAdmin } from "../middleware/auth.middleware.js";
import { getUser, updateUser, deleteUser } from "../controllers/user.controller.js";

userRouter.get("/users/:id", auth, isAdmin, getUser); // Only admins can read users
userRouter.patch("/users/:id", auth, updateUser); // Users can update their own profile
userRouter.delete("/users/:id", auth, isAdmin, deleteUser); // Only admins can delete users

export default userRouter;