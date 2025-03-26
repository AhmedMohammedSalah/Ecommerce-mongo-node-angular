import { Router } from "express";
const userRouter = Router();
import { auth, isAdmin } from "../middleware/authValidation.js";
import {
  getUser,
  updateUser,
  deleteUser,
  getAllCustomers,
  getAllSellers,
  restoreUser  
} from "../controllers/user.controller.js";
import { tokenVerify } from "../middleware/tokenVerify.js";
// [AMS] 🪪 using of verify token on all routes
userRouter.use(tokenVerify);

userRouter.get( "/users/:id", isAdmin, getUser ); // Only admins can read users

userRouter.put("/user/:id", updateUser); // Users can update their own profile
userRouter.delete("/users/:id", isAdmin, deleteUser); // Only admins can delete users
userRouter.get("/all-customers", getAllCustomers);
userRouter.get("/all-sellers", getAllSellers);




userRouter.put("/user/restore/:id", isAdmin, restoreUser);

export default userRouter;
