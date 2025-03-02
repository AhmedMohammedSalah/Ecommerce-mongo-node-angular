import User from "../models/User.js";

export async function getUser(req, res) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send({ message: "User not found" });
    res.send(user);
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).send({ message: "Invalid user ID" });
    }
    res.status(500).send({ message: "Server error" });
  }
}

export async function updateUser(req, res) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send();

    const updates = Object.keys(req.body);
    const allowedUpdates = ["name", "email", "password"];

    if (req.user.isAdmin) allowedUpdates.push("isVerified");

    const isValid = updates.every((update) => allowedUpdates.includes(update));
    if (!isValid) return res.status(400).send({ error: "Invalid updates" });

    updates.forEach((update) => (user[update] = req.body[update]));
    await user.save();
    res.send(user);
  } catch (err) {
    res.status(400).send(err);
  }
}

export async function deleteUser(req, res) {
  try {
    const user = await findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true }
    );
    if (!user) return res.status(404).send();
    res.send(user);
  } catch (err) {
    res.status(500).send();
  }
}
