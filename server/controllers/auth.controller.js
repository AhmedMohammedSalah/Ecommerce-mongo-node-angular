import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../database/models/user.model.js";
import { sendEmail } from "../Email/email.js";
import { createCustomerProfile } from "./customer.controller.js";
import { createSellerProfile } from "./seller.controller.js";
const userModel = User; // [AMS] 😒 correct naming
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

    //[AMS] 🤕 depands on user role will create profile
    if (user.role === "user") {
      let customer = await createCustomerProfile(user._id);
      console.log(customer);
      // [AMS]👋 the following line is to send mail to new users
      sendEmail(user.email);
      res.status(201).json({ user });
    } else if (user.role === "seller") {
      let seller = await createSellerProfile(user._id);
      console.log(seller);
      // [AMS]👋 the following line is to send mail to new users
      sendEmail(user.email);
      res.status(201).json({ user });
    }
    // fetch user
    // call create profile (id )
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function signin(req, res) {
  try {
    console.log("enter sign in ");

    const { email, password } = req.body;

    // [AMS]🤔 => define .select("+password") ??
    const user = await User.findOne({ email, isDeleted: false }).select(
      "+password"
    );

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    // [AMS]🔐 security layer to check if user is verified or not

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    if (!user.isVerified) {
      return res
        .status(401)
        .json({
          message: "User is not verified , please confirm your mail ",
          status: 401,
        });
    }
    const token = jwt.sign({ user }, "ARAF");
    res.status(200).json({ user, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/**
 * @author Ahmed M.Salah
 * @param {*} req
 * @param {*} res
 * @description function to verify mail in signup
 * @return res.status(200).json({ message: "Email verified" });
 */
export async function verify(req, res) {
  jwt.verify(req.params.email, "Ahmed", async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
    console.log({ obj: decoded });

    let email = decoded.email;
    const user = await userModel.findOneAndUpdate(
      { email },
      {
        isVerified: true,
      }
    );
    res.status(200).json({ message: "Email verified" });
  });
}
