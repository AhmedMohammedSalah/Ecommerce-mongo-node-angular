import fs from "fs";
import jwt from "jsonwebtoken";
// a new schema to not make thd data mandatory
import productValidSchema from "../validators/productUpdateValidSchema.js";
import { productModel } from "../database/models/product.model.js";
import path from "path";

/* [NOTHING LEFT IN UPDATE PRODUCT]:

LAYER AFTER CHECK PRODCUT EXIST:
    CHECK PRODUCT OWNED BY THE SELLER/ADMIN TO UPDATE ON IT
    YOU NEED USER ROLE + USER ID TO REACH PROFILE TO REACH THE PRODUCTS ARRAY AND SEARCH IF THE PRODUCT ID EXIST
*/

/**
 * [DUPLICATED] function decrypt the token
 *
 * @param: token:
 * - Added: in header
 * - named: `token`
 * - contain: seller data
 * - goal: get seller id to be used in image path
 */
const decryptToken = (token, res) => {
  const key = "ARAF";
  try {
    return jwt.verify(token, key);
  } catch {
    return res.json({ err: "INVALID TOKEN" });
  }
};

/**
 * main function:
 *
 * - first stage in the product update route
 * - GOAL: check if ID correct before doing anything
 */
export const checkProductExist = async (req, res, next) => {
  // FIND PRODUCT USING ID IN URL
  const productId = req.params.id;
  const foundProduct = await productModel.findById(productId);

  if (!foundProduct) {
    return res.json({ msg: "product not exist. check product ID" });
  }

  //--STORE PRODUCT FOR LATER USE---
  req.foundProduct = foundProduct;
  //--------------------------------

  next(); // EVERYTHING OK
};

/**
 * Helper Helper function:
 *
 * - update image: remove the old , add the new one
 */
const updateImg = (req, res) => {
  // DECRYPT TOKEN
  const data = decryptToken(req.headers.token, res);

  // GOAL: UPDATE IMAGE
  const originalImgPath = req.foundProduct.imagePath;

  console.log("\n\noriginal image path that we wil remove the image from = ", originalImgPath, "\n\n"); //debug

  // CHECK PATH EXISTENCE FIRST
  if (fs.existsSync(originalImgPath)) {
    // REMOVE IMAGE IN OLD PATH
    fs.unlinkSync(originalImgPath, (err) => {
      if (err) {
        console.error("Error deleting file:", err.message);
      } else {
        console.log("File deleted successfully:", originalImgPath);
      }
    });
  }


  // ADD THE NEW ONE

  // [AMS] ✅ Correct Naming
  const ext = String(req.file.originalname).split(".")[1];
  const dirPath = path.dirname(originalImgPath);
  const newImgPath = `${dirPath}/${req.foundProduct.productName}.${ext}`;


  console.log("\n\n the new image path that is based on the original path = ", newImgPath, "\n\n");


  // WRITE FILE TO DISK FROM BUFFER
  fs.writeFileSync(newImgPath, req.file.buffer);
  
  console.log("\nafter adding the new image \n"); //debug

  // UPDATE IMAGE PATH ON FOUND PRODUCT
  req.foundProduct.imagePath = newImgPath;
  console.log("req.foundProduct.imagePath = ", req.foundProduct.imagePath);
};

/**
 * Helper function:
 *
 *  - check if there image uploaded
 *  - (if uploaded): check image size limit
 *  - (if saitisfied): update image using another helper funtion
 */
const validateUpdatedImg = (req, res) => {
  // check image uploaded
  if (req.file) {
    // check image size
    const maxSize = 100 * 1024 * 1024;
    if (req.file.size > maxSize) {
      // feedback
      return false;
    }

    // update the image
    updateImg(req, res);
    return true;
  }

  // nothing uploaded, do nothing
  return true;
};

/**
 * main function :
 *
 * - validate inserted data
 * - validate image and update it (store new image + change image path in DB)
 */
export const validateUpdatedProduct = (req, res, next) => {

  // convert string to json object
  req.body = JSON.parse(req.body.data);

  // check constraints + give all errors found
  const validation = productValidSchema.validate(req.body, {
    abortEarly: false,
  });

  // wrong constraint found
  if (validation.error) {
    return res.status(400).json({
      errors: validation.error.details.map((err) => err.message),
    });
  }

  //-validate the image---------------------
  const valid = validateUpdatedImg(req, res);
  //----------------------------------------

  // NEXT OR MISTAKE
  valid ? next() : res.json({ err: "image size exceed 100mb" });
};
