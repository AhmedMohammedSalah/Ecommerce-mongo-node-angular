import express from "express";
import { dbConnection } from "./database/dbConnection.js";
import { promoRouter } from "./routes/promo.routes.js";
import categoryRouter from "./routes/category.routes.js";
import productRoutes from "./routes/product.routes.js";

import authRouter from "./routes/auth.routes.js"; 
import userRouter from "./routes/user.routes.js"; 
import adminRouter from "./routes/admin.routes.js";

const app = express();
const port = 3030;
dbConnection();
app.use(express.json());

app.use(categoryRouter);
app.use(promoRouter);
app.use(productRoutes);

app.use(authRouter);
app.use(userRouter); 
app.use(adminRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
