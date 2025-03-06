import jwt from "jsonwebtoken";
import User from "../database/models/user.model.js";
import { signupSchema, signinSchema } from "../validators/auth.validator.js";

export const validateSignin = (req, res, next) => {
  const validation = signupSchema.validate(req.body, { abortEarly: false });
  if (validation.error) {
    return res.status(400).json({
      errors: validation.error.details.map((err) => err.message),
    });
  }
  next();
};
export const validateLogin = (req, res, next) => {
  const validation = signinSchema.validate(req.body, { abortEarly: false });
  if (validation.error) {
    return res.status(400).json({
      errors: validation.error.details.map((err) => err.message),
    });
  }
  next();
};

export const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) throw new Error("Authentication failed");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded.id, isDeleted: false });
    if (!user) throw new Error("User not found");
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Please authenticate" });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};
  