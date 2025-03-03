import express from "express";
import mongoose from "mongoose";
import { errorHandler } from "./middlewares/errorHandler.js";
import cartRoutes from "./routes/cart.js";
import {dbconnection} from "./models/dbconection.js";
import sellerRoutes from "./routes/seller.Routes.js";


const app = express();
dbconnection;

app.use(express.json());

app.use("/sellers", sellerRoutes); 
app.use("/carts", cartRoutes);

app.use(errorHandler);



  app.listen(3000, () => {
    console.log(" Server is running on port 3000");
});
