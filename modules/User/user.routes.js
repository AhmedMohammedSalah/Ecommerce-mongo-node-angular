import { Router } from "express";
import {
  getUsers,
  getUser,
  addUser,
  updateUser,
  deleteUser,
} from "./user.controller.js";

export const userRouter = Router();

userRouter.delete("/users/:id", async (req, res) => {
  await deleteUser(req.params.id, res);
});
