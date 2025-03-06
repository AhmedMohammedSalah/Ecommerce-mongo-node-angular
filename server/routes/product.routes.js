//#region Packages
import express from "express"
import multer from "multer";
//#endregion

//#region Module => Product 
import {addProduct, updateProduct, deleteProduct}   from "../controllers/product.controller.js"
//#endregion

//#region Middleware
import { validateProduct, verifyUser }                          from "../middleware/addProduct_valid.js";
import {checkProductExist, validateUpdatedProduct}  from "../middleware/updateProduct_valid.js";
//#endregion
//================================================================================================

// router
const productRoutes = express.Router();

// [SHARED MIDDLEWARE]: store it only on RAM
const upload = multer({storage: multer.memoryStorage()});


// ADD [seller/admin] PRODUCT 
//----------------------------------------------------------------
productRoutes.post("/products/", verifyUser,                  // [MiddleWare]: verify user layer + [check user exist +(store profile)]
                                 upload.single("productImg"), // [MiddleWare]: upload (image + data)
                                 validateProduct,             // [MiddleWare]: validate (image(validate? store) + data)
                                 addProduct);                 // [Controller]: add product


// UPDATE [selle/admin] PRODUCT
//-------------------------------------------------------------
productRoutes.put("/products/:id",  checkProductExist,           // [MiddleWare]: using id in URL
                                    upload.single("productImg"), // [MiddleWare]: upload data + image
                                    validateUpdatedProduct,      // [MiddleWare]: validate data + image inserted 
                                    updateProduct);              // [Controller]: update product


// DELETE PRODUCT
//------------------------------------------------------------
productRoutes.delete("/products/:id", deleteProduct);            // [Controller]: delete existed product

export default productRoutes

