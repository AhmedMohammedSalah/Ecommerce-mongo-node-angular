import express from "express"
import {storeProduct} from "./product.controller.js"
import passProductData from "../../Middleware/product.middleware.js"


// router
const productRoutes = express.Router();

// create a product
productRoutes.post("/products",passProductData, storeProduct);

export default productRoutes