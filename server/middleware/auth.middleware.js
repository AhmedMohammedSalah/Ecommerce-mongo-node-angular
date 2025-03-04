/**
 * Authentication and authorization middleware
 */
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function auth(req, res, next) {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader)
      return res.status(401).json({ message: "No token provided" });

    const token = authHeader.replace("Bearer ", "");

    jwt.verify(token, "myToken", async (err, decoded) => {
      try {
        if (err) return res.status(401).json({ message: "Invalid token" });

        const user = await User.findOne({
          _id: decoded._id,
          isDeleted: false,
        });

        if (!user) return res.status(401).json({ message: "User not found" });

        req.user = user;
        next();
      } catch (error) {
        res.status(500).json({ message: "Server error" });
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}

export function isAdmin(req, res, next) {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
}
