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


/**
 *   
 * @description function add new user
 * @author  rehab kamal
 * @edit not until now 
 *  @date 2023-02-22
 *  @returns {object} user object
 
 *  
 
 *  
 */
userRouter.addUser( async (req, res) => {
  await addUser(req.body, res);
  });




userRouter.delete("/users/:id", async (req, res) => {
  await deleteUser(req.params.id, res);
});


// update the user
userRouter.put("/users/:id", async (req,res) => {
  console.log("hello in update"); // debug
  await updateUser(req.params.id, req.body, res);
} )
