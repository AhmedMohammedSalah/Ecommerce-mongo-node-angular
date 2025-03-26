import customerModel from "../database/models/customer.model.js";
import sellerModel from "../database/models/seller.model.js";
import User from "../database/models/user.model.js";
import bcrypt from "bcrypt";

export async function getUser(req, res) {
  try {
    const user = await User.findById(req.params.id).active();
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function updateUser(req, res) {
  console.log("Enter Update user");

  try {
    const { id } = req.params;

    const updates = req.body;
    const user = await User.findById(id); //.active();
    if (!user) return res.status(404).json({ message: "User not found" });
    // Allow admins to update isVerified
    if (req.user.role === "admin") {
      if (updates.isVerified !== undefined) {
        user.isVerified = updates.isVerified;
      }
    }
    // Allow users to update their own profile
    if (req.user.role === "user" && req.user.id !== id) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    // Update allowed fields
    const allowedUpdates = ["name", "email", "password"];
    req.body.password = await bcrypt.hash(req.body.password, 10);
    allowedUpdates.forEach((field) => {
      if (updates[field] !== undefined) {
        user[field] = updates[field];
      }
    });

    await user.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function deleteUser(req, res) {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
export async function getAllCustomers(req, res) {
  const userData = req.user;
  if (userData.role != "admin") {
    return res.json({
      msg: " UNAUTHUserORIZED ACCESS",
    });
  }
  //fetch it's customer profile else
  const customers = await customerModel.find().populate("_id");
  res.json(customers);
}

export async function getAllSellers(req, res) {
  const userData = req.user;
  if (userData.role != "admin") {
    return res.json({
      msg: " UNAUTHUserORIZED ACCESS",
    });
  }
  //fetch it's customer profile else
  const sellers = await sellerModel.find().populate("userId");
  res.json(sellers);
}









export async function restoreUser(req, res) {
  try {
    const { id } = req.params; // نستخدم الـ id المار كـ parameter
    const user = await User.findByIdAndUpdate(
      id,
      { isDeleted: false },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User restored successfully", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
