// packages
import express from "express"
import multer from "multer";

// Module => Product 
import {addProduct, updateProduct}                  from "../controllers/product.controller.js"

// Middleware
import { validateProduct }                          from "../middleware/addProduct_valid.js";
import {checkProductExist, validateUpdatedProduct}  from "../middleware/updateProduct_valid.js";
//================================================================================================

// router
const productRoutes = express.Router();

// [SHARED MIDDLEWARE]: store it only on RAM
const upload = multer({storage: multer.memoryStorage()});


// ADD PRODUCT 
//-------------------------------------------------------------
productRoutes.post("/products", upload.single("productImg"), // [MiddleWare]: upload (image + data)
                                validateProduct,             // [MiddleWare]: validate (image + data)
                                addProduct);                 // [Controller]: add product




// UPDATE PRODUCT
//-------------------------------------------------------------
productRoutes.put("/products/:id",  checkProductExist,           // [MiddleWare]: using id in URL
                                    upload.single("productImg"), // [MiddleWare]: upload data + image
                                    validateUpdatedProduct,      // [MiddleWare]: validate data + image inserted 
                                    updateProduct);              // [Controller]: update product




export default productRoutes