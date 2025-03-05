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

    // check token exist
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



const get_ID_Email_BasedRole = async(userRole, req) => {

    // DEBUG
    console.log("INSIDE GETTING ID EMAIL FUNCTION.....AND ROLE IS", userRole);

    var sellerId,sellerEmail;

    // CHECK ROLE
    if (userRole == "seller"){

        // EXTRACT SELLER ID + EMAIL
        sellerId = req.userData.id;
        sellerEmail = req.userData.email;

    }
    else if ( userRole == "admin"){

        // GET SELLER ID WHO WANT TO ADD THE PRODUCT FOR  [URL]
        sellerId = req.params.sellerId;

        // DEBUG
        console.log("GOTTEN SELLER ID FROM URL =====>", sellerId);

        // SEARCH THE SELLER => GET EMAIL
        userModel.findById(sellerId)
        .then( foundSeller =>  {

            //DEBUG
            console.log("AFTER SEARCHING THE SELLER ======>", foundSeller);

            if(foundSeller){  

                //DEBUG
                console.log("IF SELLER FOUND.......")

                sellerEmail = foundSeller.email; 

                //DEBUG
                console.log(`/nSELLER EMAIL ====>`, sellerEmail);
            }
            else{ 
                console.log("COULDN'T FIND THE SELLER");
                return null 
            }

        })
        .catch(() => {
            console.log("COULDN'T FIND THE USER");
        })


    }

    // DEBUG
    console.log("FINALLY THE ID , EMAIL ===>", sellerId, sellerEmail);

    return ([sellerId, sellerEmail]);
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
export const storeImg = async(req, res)=>{

    // DEBUG
    console.log("HELLO FROM INSIDE THE STOREIMAGE");

    const userRole = req.userData.role;

    //DEBUG
    console.log("THE ROLE ==>", userRole);

    const ID_Email = await get_ID_Email_BasedRole(userRole, req)


    // DEBUG
    console.log("GET ID AND EMAIL BASED ON USER ROLE", ID_Email);

    if(!ID_Email){
        return res.json({msg: "admin privillages: seller not found, check its id on url"});
    }

    const [sellerId, sellerEmail] = ID_Email;

    const dirPath = `uploads/${sellerEmail}`;


    //DEBUG
    console.log("DIR PATH ===> ", dirPath);

    //-QUICK ADD sellerId to body------
    req.body.sellerId = sellerId;
    //---------------------------------
    
    // CREATE IF PATH NOT EXIST
    if(!fs.existsSync(dirPath))
        fs.mkdirSync(dirPath,{recursive:true});

    // GOAL: STORE IMAGE

        // IMAGE PATH
        const imgPath = `${dirPath}/${req.file.originalname}`;


        //DEBUG
        console.log("IMAGE PATH ==>", imgPath);

        // WRITE FILE TO DISK FROM BUFFER
        fs.writeFileSync(imgPath, req.file.buffer);

        //--ADD IMAGE PATH TO `req.body`--
        req.body.imagePath = imgPath;
        //--------------------------------

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

    // DEBUG
    console.log("HELLO AGAIN BEFORE STORE THE IMAGE....");

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

    //debug
    console.log("HELLO IN IMAGE VALIDATION BEGIN....")

    //-validate the image---
    validateImg(req,res);
    //----------------------

    // everything ok
    next();

}
