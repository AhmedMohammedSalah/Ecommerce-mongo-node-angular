// packages
import express from "express"
import multer from "multer";

// Module => Product 
import {addProduct, updateProduct, hardDelProduct}   from "../controllers/product.controller.js"
//#endregion

//#region Middleware
import { validateProduct, verifyUser }                          from "../middleware/addProduct_valid.js";
import {checkProductExist, validateUpdatedProduct}  from "../middleware/updateProduct_valid.js";
import { tokenVerify } from "../middleware/tokenVerify.js";
//#endregion
//================================================================================================

// router
const productRoutes = express.Router();

// [AMS] 🪪 using of verify token on all routes
productRoutes.use(tokenVerify);

// [SHARED MIDDLEWARE]: store it only on RAM
const upload = multer({storage: multer.memoryStorage()});


// ADD [seller/admin] PRODUCT 
//----------------------------------------------------------------
productRoutes.post("/products/", verifyUser,                  // [MiddleWare]: verify user layer + [check user exist +(store profile)]
                                 upload.single("productImg"), // [MiddleWare]: upload (image + data)
                                 validateProduct,             // [MiddleWare]: validate (image(validate? store) + data)
                                 addProduct);                 // [Controller]: add product


// UPDATE [selle/admin] PRODUCT ::: soft-delete✅ ::: add-review❗
//-----------------------------------------------------------------
productRoutes.put("/products/:id",  checkProductExist,           // [MiddleWare]: using id in URL
                                    upload.single("productImg"), // [MiddleWare]: upload data + image
                                    validateUpdatedProduct,      // [MiddleWare]: validate data + image inserted 
                                    updateProduct);              // [Controller]: update product


// DELETE PRODUCT
//------------------------------------------------------------
productRoutes.delete("/products/hardDel/:id", checkProductExist, hardDelProduct);   // [Controller]


export default productRoutes

