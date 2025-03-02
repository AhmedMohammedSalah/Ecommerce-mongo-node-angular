// packages
import express from "express"
import multer from "multer";

// Module => Product 
import {storeProduct}                        from "./product.controller.js"

// Middleware
import { validateProductLayer }              from "../../Middleware/validateProductLayer.js";
import { imgValidationLayer } from "../../Middleware/product.middleware.js";

//==========================================================================================

// router
const productRoutes = express.Router();

// image middleware: store it only on RAM
const upload = multer({storage: multer.memoryStorage()});

// temp func
const pass = ()=>{};

// ADD PRODUCT 
productRoutes.post("/products", upload.single("productImg"),    // upload image + DATA
                                validateProductLayer,           // data validation layer
                                imgValidationLayer,             // image validation layer
                                pass);                          // insertion layer

export default productRoutes