import { Router } from "express";
import {
  getUsers,
  getUser,
  addUser,
  updateUser,
  deleteUser,
} from "./user.controller.js";

export const userRouter = Router();

userRouter.get("/users", async (req, res) => {
  await getUsers(res);
});

userRouter.get("/users/:id", async (req, res) => {
  await getUser(req.params.id, res);
});

userRouter.delete("/users/:id", async (req, res) => {
  await deleteUser(req.params.id, res);
});
