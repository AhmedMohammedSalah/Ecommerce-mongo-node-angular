import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../database/models/user.model.js"

export async function signup(req, res) {
  try {
    const { name, email, password, role } = req.body;
    // middleware 
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
      isVerified: role === "admin" ? true : false, 
    });
    await user.save();
    // AMS -> not usefull code
    // const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    //   expiresIn: "1h",
    // });


    // AMS  depands on user role will create profile
    // fetch user
    // call create profile (id )
    res.status(201).json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function signin(req, res) {
  try {
    const { email, password } = req.body;
    // AMS => define .select("+password") ??
    const user = await User.findOne({ email, isDeleted: false }).select(
      "+password"
    );
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { user },
      "ARAF"
    );
    res.status(200).json({ user, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}