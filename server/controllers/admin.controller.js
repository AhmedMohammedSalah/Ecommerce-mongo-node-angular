import User from "./models/User.js";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
const createAdminUser = async () => {
  try {
    const adminUser = new User({
      name: "Admin",
      email: "admin@example.com",
      password: await bcrypt.hash("adminpassword", 10), // Hash the password
      isAdmin: true,
      isVerified: true,
    });

    await adminUser.save();
    console.log("Admin user created:", adminUser);
  } catch (err) {
    console.error("Error creating admin user:", err);
  } finally {
    mongoose.connection.close(); // Close the database connection
  }
};
