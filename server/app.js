import express from "express";
import { dbConnection } from "./database/dbConnection.js";
import { promoRouter } from "./routes/promo.routes.js";
import categoryRouter from "./routes/category.routes.js";
import productRoutes from "./routes/product.routes.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import sellerRoutes from "./routes/seller.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import { reviewRouter } from "./routes/review.routes.js";
import swaggerUi from "swagger-ui-express";
import orderRoutes from "./routes/order.routes.js";
import customerRouter from "./routes/customer.routes.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Get the directory name using import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// [AMS] 😒 naming ports
const senuPort = 3030;
const defaultPort = 3000;

dbConnection();
app.use(express.json());
// enable cors
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(
  cors({
    origin: "http://localhost:4200", // Allow requests from this origin
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization", "token"], // Allow the 'token' header
  })
);
app.options("*", cors()); // Handle preflight requests for all routes

// [AMS] 🚀 using swagger for documentation api
import fs from "fs";
import { paymentRouter } from "./routes/payment.routes.js";
const swaggerFilePath = path.resolve("./utils/swagger-output.json");
const swaggerDocument = JSON.parse(fs.readFileSync(swaggerFilePath, "utf-8"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// [AMS] 🚀 using of all routers
// ---------without token verify
app.get("", (req, res) => res.send("Hello"));
app.use(productRoutes);
app.use(authRouter);
app.use(cartRoutes);
app.use(orderRoutes);
//------------------------------
app.use(categoryRouter);
app.use(promoRouter);
app.use(reviewRouter);
app.use(userRouter);
app.use(sellerRoutes);
app.use(customerRouter);

app.use(paymentRouter);

// app.listen(defaultPort, () => {
//   console.log(`Server is running on port`);
// });

app.listen(defaultPort, () => {
  console.log(`Server is running on port`);
});
