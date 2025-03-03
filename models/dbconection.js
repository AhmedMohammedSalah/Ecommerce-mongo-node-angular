import mongoose from "mongoose";

export const dbconnection = mongoose.connect("mongodb://127.0.0.1:27017/e_commerce")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("MongoDB Connection Error:", err));
