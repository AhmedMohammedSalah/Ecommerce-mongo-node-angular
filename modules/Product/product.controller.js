import { productModel } from '../../database/Models/product.model.js';
import multer from 'multer';
import fs from "fs";

/**
 * [IN MIDDLEWARE]:
 * Stores uploaded image in 'uploads/{sellerID}/' directory.
 */
const storeImg = (req,sellerID) => {

  const uploadPath = `uploads/${sellerID}`;
  const imgName = req.files.productImg[0].originalname;

  // CREATE DIR IF IT DOESN'T EXIST
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  // STORAGE
  const storage = multer.diskStorage({

    // DESTINATION
    destination: function (req, file, cb) {
      cb(null, uploadPath); 
    },

    // NAMING
    filename: function (req, file, cb) {
      cb(null, imgName); // Use original filename
    }
  });

  // return image path
  return `${uploadPath}/${imgName}`
};

// Middleware for handling file uploads
const upload = multer();

/**
 * Middleware to handle product image and data
 */
export const passProductData = (req, res, next) => {
  upload.fields([
    { name: "productImg", maxCount: 1 },
    { name: "productData", maxCount: 1 }
  ])(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    // CHECK IF IMAGE EXISTS
    if (!req.files || !req.files.productImg || req.files.productImg.length === 0) {
      return res.status(400).json({ msg: "No image uploaded" });
    }

    // EXTRACT IMAGE FILE
    const imageFile = req.files.productImg[0];
    if (!imageFile || !imageFile.path) {
      return res.status(400).json({ msg: "Invalid image upload" });
    }

    // PARSE JSON DATA
    try {
      req.body = JSON.parse(req.body.productData);
    } catch (error) {
      return res.status(400).json({ msg: "Invalid JSON format" });
    }

    // ATTACH IMAGE PATH
    req.body.imagePath = imageFile.path;
    
    next(); // Proceed to the next function
  });
};

//--[SIMULATION]---seller ID from token--------
const sellerID = "67bde250bd09384a7ccb190d";
//--------------------------------------------

/**
 * Add a new product
 */
export const storeProduct = async (req, res) => {
  try {
    // GET DATA FROM REQUEST BODY
    const data = req.body;

    // CHECK IF PRODUCT ALREADY EXISTS
    const foundProduct = await productModel.findOne({
      productName: data.productName,
      categoryId: data.categoryId
    });

    if (foundProduct) {
      return res.status(409).json({ err: "Product already exists. Check name and category." });
    }

    // ADD SELLER ID
    data.sellerId = sellerID;

    //ADD IMAGE PATH----------------------------------------------------
    console.log("storeImg(req, sellerID)  = ", storeImg(req,sellerID));
    //------------------------------------------------------------------

    // ACTUAL INSERTION INTO DATABASE
    const insertedProduct = await productModel.create(data);
    res.json({ msg: "Product inserted successfully", insertedProduct });

  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

