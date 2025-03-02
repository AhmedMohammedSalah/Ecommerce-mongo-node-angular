import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import sellerRoutes from "./routes/sellers.js";
import { errorHandler } from "./middlewares/errorHandler.js";

dotenv.config();
const app = express();

app.use(express.json());

app.use("/sellers", sellerRoutes); 

app.use(errorHandler);


export const myConnection = mongoose.connect("mongodb://127.0.0.1:27017/e_commerce")
  .then(() => console.log(" MongoDB Connected"))
  .catch(err => console.log(" MongoDB Connection Error:", err));

  app.listen(3000, () => {
    console.log(" Server is running on port 3000");
});
