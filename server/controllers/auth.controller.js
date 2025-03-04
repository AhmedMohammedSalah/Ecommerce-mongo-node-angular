/**
 * Handles authentication logic
 */
import { compare } from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function signup(req, res) {
  try {
    const user = new User(req.body);
    await user.save();
    const token = jwt.sign({ _id: user._id }, "myToken");
    res.status(201).send({ user, token });
  } catch (err) {
    res.status(400).send(err);
  }
}

export async function signin(req, res) {
  try {
    const user = await User.findOne({
      email: req.body.email,
      isDeleted: false,
    }).select("+password");
    if (!user || !(await compare(req.body.password, user.password))) {
      return res.status(401).send({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ _id: user._id }, "myToken");
    res.send({ user, token });
  } catch (err) {
    res.status(400).send(err);
  }
}
