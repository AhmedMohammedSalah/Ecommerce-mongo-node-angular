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


//-update the user-------------------------------
userRouter.put("/users/:id", async (req,res) => {
  console.log("hello in update"); // debug
  await updateUser(req.params.id, req.body, res);
} )
//-----------------------------------------------