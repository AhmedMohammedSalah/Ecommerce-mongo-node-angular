import fs from 'fs'
import jwt from "jsonwebtoken"
import productValidSchema from "../validators/productValidSchema.js";
import User from '../database/models/user.model.js'; // user model

// for context
const userModel = User;

/*----------------------------------
THERE IS SOMETHING NOT HANDLED
THAT ADMIN CAN ADD/ UPDATE PRODUCT
-----------------------------------*/

/*
 [token will contain the id generated from mongodb]
*/


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
    catch { return null }
}


/** function:
 * - verify the user coming in token, whether admin or seller
 */
export const verifyUser = (req,res, next) =>{

    // check token added on the header [DEV]
    if(!req.headers.token) 
        {return res.json({msg :"verifyUser:TOKEN NOT EXIST"})}

    // decrypt user data [token in header]
    const userData = decryptToken(req.headers.token, res);

    if (userData){
        // CHECK ROLE
        if(userData.role == "admin" || userData.role == "seller"){

            // store data for later use
            req.userData = userData;
            next(); 
        }
        else {return res.json({msg :"verifyUser: UNAUTHORIZED ACCESS"});}
    }
    else{
        return res.json({msg :"verifyUser: INVALID TOKEN"});
    }


}


/**
 * function store the image in `uploads/sellerId/`
 * 
 * - steps: decypt token 
 * - get sellerId + (add to data)
 * - add on the path
 * - store image
 * - add local path to the product data
 */
export const storeImg = (req, res)=>{

    const userRole = req.userData.role;
    const dirPath = (userRole == "admin")?  
        `uploads/admin`:
        `uploads/${req.userData.id}`;  // check id or _id
    
    // CREATE IF PATH NOT EXIST
    if(!fs.existsSync(dirPath))
        fs.mkdirSync(dirPath,{recursive:true});

    // IMAGE PATH
    const imgPath = `${dirPath}/${req.file.originalname}`;

    // WRITE FILE TO DISK FROM BUFFER
    fs.writeFileSync(imgPath, req.file.buffer);

    //--ADD IMAGE PATH TO `req.body`--
    req.body.sellerId = req.userData.id;
    req.body.imagePath = imgPath;
    //--------------------------------

    // return that there is no message
    return false

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
    if(req.file.size >= maxSize){ return res.json({err:"image size exceed 100mb"}) };

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

    // VALIDATE DATA
    //--------------

    // convert string to json object
    try { req.body = JSON.parse(req.body.data); } 
    catch {  return res.json({ error: "Invalid JSON" }); } //DEV
    

    // check constraints + give all errors found
    const validation = productValidSchema.validate(req.body, {abortEarly: false});

    // wrong constraint found
    if(validation.error){

        return res.status(400).json({
            errors: validation.error.details.map(err => err.message)
        })
    }

    console.log("\ndata validated\n") //DEBUG

    // VALIDATE IMAGE + STORE
    //------------------------

    //-validate the image---
    const err = validateImg(req,res);

    if(err){return err}; // to return the error
    //----------------------

    console.log("\nimage stored and validated\n") //DEBUG

    // everything ok
    next();

}
