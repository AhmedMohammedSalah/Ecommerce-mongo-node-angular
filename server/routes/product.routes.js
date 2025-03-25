//#region packages
import express from "express"
import multer from "multer";
//#endregion

//#region Module => Product 
import { addProduct,
         updateProduct, 
         hardDelProduct,
         getProductById,
         getAllProducts,
         getAdminProducts,
         getSellerProducts,
         searchProductsByName,
         searchProductsByPrice,
         searchProductsByCategory}   from "../controllers/product.controller.js"
//#endregion

//#region Middleware
import { validateProduct, verifyUser }              from "../middleware/addProduct_valid.js";
import {checkProductExist, validateUpdatedProduct}  from "../middleware/updateProduct_valid.js";

//#endregion
//================================================================================================

// router
const productRoutes = express.Router();



// [SHARED MIDDLEWARE]: store it only on RAM
// store [iamge + data] on RAM [till the validation end]
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



// READ PRODUCTS : [NO SECURITY NEEDED] <forgot to exclude deleted products>
//---------------------------------------------------------------------------
productRoutes.get("/products/",getAllProducts);                                     // ALL 
productRoutes.get('/products/search/:name', searchProductsByName);                  // BY NAME: user
productRoutes.get("/products/price/:max?/:min?",searchProductsByPrice);             // BY PRICE: user
productRoutes.get('/products/category/:categoryId', searchProductsByCategory);      // BY CAT: user


// get seller its own products
productRoutes.get("/products/admin/",getAdminProducts);
productRoutes.get("/products/seller/:sellerId?", getSellerProducts);


// get product by id (endpoint without "s" 😉)
productRoutes.get("/product/:id?",getProductById);
export default productRoutes



