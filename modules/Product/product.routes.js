import multer from 'multer';
import express from "express"
import {storeProduct} from "./product.controller.js"

/**[MIDDLEWARE]:
 * 
 * pass the image stored in `image`[postman]
 * + check [fileExistence - size]
 * 
*/const passImage = (req, res, next) => {

    multer().single("image")((req, res) => {

        // CHECK FILE-EXIST
        if (!req.file) { return res.status(400).json({ error: "No file uploaded" });}

        // CHECK SIZE : SIZE(100 MB)
        const maxSize = 100 * 1024 * 1024;
        if (req.file.size > maxSize) {
            return res.status(400).json({ error: "File size exceeds 100MB limit" });
        }

        next(); 
    });
};


// router
const productRoutes = express.Router();

// create a product
productRoutes.post("/products",passImage, storeProduct);

export default productRoutes