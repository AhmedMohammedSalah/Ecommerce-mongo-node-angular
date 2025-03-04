import User from "../models/user.model.js";

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
  try {
    const { id } = req.params;
    const updates = req.body;
    const user = await User.findById(id).active();
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