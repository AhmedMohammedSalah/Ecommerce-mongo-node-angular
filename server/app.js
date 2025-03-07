import express from "express";
import { dbConnection } from "./database/dbConnection.js";
import { promoRouter } from "./routes/promo.routes.js";
import categoryRouter from "./routes/category.routes.js";
import productRoutes from "./routes/product.routes.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import adminRouter from "./routes/admin.routes.js";
import sellerRoutes from "./routes/seller.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import { reviewRouter } from "./routes/review.routes.js";
import swaggerUi from 'swagger-ui-express';

const app = express();
// [AMS] 😒 naming ports
const senuPort = 3030;
const defaultPort = 3000;

dbConnection();
app.use(express.json());

// [AMS] Setup Swagger
import fs from "fs"; 
import path from "path";
const swaggerFilePath = path.resolve("./utils/swagger-output.json");
const swaggerDocument = JSON.parse(fs.readFileSync(swaggerFilePath, "utf-8"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// [AMS] 🚀 using of all routers
app.use(categoryRouter);
app.use(promoRouter);
app.use(productRoutes);
app.use(reviewRouter);
app.use(authRouter);
app.use(userRouter);
app.use(adminRouter);
app.use(sellerRoutes);
app.use(cartRoutes);

// [AMS] 🚀 using swagger for documentation api
app.listen(defaultPort, () => {
  console.log(`Server is running on port ${defaultPort}`);
});
