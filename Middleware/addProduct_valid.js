import fs from 'fs'
import jwt from "jsonwebtoken"
import productValidSchema from "../Validator/productValidSchema.js";

/*----------------------------------
THERE IS SOMETHING NOT HANDLED
THAT ADMIN CAN ADD/ UPDATE PRODUCT
-----------------------------------*/

/** 
 * function decypt the token
 * 
 * @param: token: 
 * - Added: in header
 * - named: `token`
 * - contain: seller data
 * - goal: get seller id to be used in image path
 */
const decryptToken = (token, res) =>{

    const key = "senu123456789senu123456789senu123456789";
    try   { return jwt.verify(token, key) }
    catch { return res.json({err:"INVALID TOKEN"}) }
}


/**
 * function store the image in `uploads/sellerId/`
 * 
 * - steps: decypt token 
 * - get sellerId + (quick: add to data)
 * - add on the path
 * - store image
 * - add local path to the product data
 */
export const storeImg = (req, res)=>{
    
    // DECRYPT TOKEN
    const data = decryptToken(req.headers.token, res);

    // EXTRACT SELLER ID + ADD ON PATH
    const sellerId = data.sellerId;
    const dirPath = `uploads/${sellerId}`;

    //-QUICK ADD sellerId to body------
    req.body.sellerId = sellerId;
    //---------------------------------
    
    // CREATE IF PATH NOT EXIST
    if(!fs.existsSync(dirPath))
        fs.mkdirSync(dirPath,{recursive:true});

    // GOAL: STORE IMAGE

        // IMAGE PATH
        const imgPath = `${dirPath}/${req.file.originalname}`;

        // WRITE FILE TO DISK FROM BUFFER
        fs.writeFileSync(imgPath, req.file.buffer);

        // ADD IMAGE PATH TO `req.body`
        req.body.imagePath = imgPath;

   

}

/**
 * function validate image before storing by:
 * 
 * - check if the image passed
 * - check image size
 * - then store it
 */
export const validateImg = (req, res) => {

    // check image exist
    if(!req.file) {return res.json({err: "image didn't uploaded"})};

    // check image size
    const maxSize = 100*1024*1024;
    if(req.file.size >= maxSize){return res.json({err:"image size exceed 100mb"})};

    // store image
    storeImg(req,res);

}



/**
 * function validate both ( product data + image uploaded )
 * 
 * - convert data to object
 * - validate with JOI schema on data
 * - validate on the image using function
 */
export const validateProduct = (req, res, next) =>{

    // convert string to json object
    req.body = JSON.parse(req.body.data);

    // check constraints + give all errors found
    const validation = productValidSchema.validate(req.body, {abortEarly: false});

    // wrong constraint found
    if(validation.error){

        return res.status(400).json({
            errors: validation.error.details.map(err => err.message)
        })
    }

    //-validate the image---
    validateImg(req,res);
    //----------------------

    // everything ok
    next();

}
