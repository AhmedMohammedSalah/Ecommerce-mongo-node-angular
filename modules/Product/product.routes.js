// packages
import express from "express"
import multer from "multer";

// Module => Product 
import {storeProduct}                   from "./product.controller.js"

// Middleware
import { validateProduct }              from "../../Middleware/validateProductLayer.js";
//==========================================================================================

// router
const productRoutes = express.Router();

// image middleware: store it only on RAM
const upload = multer({storage: multer.memoryStorage()});

// temp func
const pass = ()=>{console.log("HELLO IN INSERTION LAYER")};

// ADD PRODUCT 
productRoutes.post("/products", upload.single("productImg"),    // upload image + DATA
                                validateProduct,           // data validation layer
                                storeProduct);                          // insertion layer

export default productRoutes