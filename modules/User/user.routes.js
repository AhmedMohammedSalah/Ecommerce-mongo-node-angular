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

userRouter.post("/users", async (req, res) => {
  await addUser(req.body, res);
});

userRouter.put("/users/:id", async (req, res) => {
  await updateUser(req.params.id, req.body, res);
});

userRouter.delete("/users/:id", async (req, res) => {
  await deleteUser(req.params.id, res);
});
