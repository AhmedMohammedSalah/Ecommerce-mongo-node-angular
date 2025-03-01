import express from "express";
import { dbConnection } from "./database/dbConnection.js";
import { promoRouter } from "./routes/promo.routes.js";
import categoryRouter from "./routes/category.routes.js";

const app = express();
dbConnection();
app.use(express.json());
app.use(categoryRouter);
app.use(promoRouter);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
