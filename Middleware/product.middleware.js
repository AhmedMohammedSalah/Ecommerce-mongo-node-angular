import fs from 'fs'
import multer from "multer";
import jwt from "jsonwebtoken"

// check image exist,
// check the size of the image,
// create image path if not exist


const decyptToken = (token) =>{

    const key = "senu123456789senu123456789senu123456789";
    try{
        // decript token
        const decoded = jwt.verify(token, key);
        console.log("decyptToken : decoded token = ", decoded); // debug
        return decoded;
    }
    catch{
        console.log("invalid token");
        return null;
    }
}


export const createImgPath = ()=>{
    
    // decrypt token to get seller id
    const data = decyptToken(req.headers.token);

    // extract seller id + add on path
    const sellerId = data.sellerId;
    const imgPath = `uploads/${sellerId}`;
    
    // create if file not exist
    if(!fs.existsSync(imgPath))
        fs.mkdirSync(imgPath,{recursive:true});

    // ADD image path in product data
    req.body.imagePath = imgPath;
    
    // return
    return imgPath
}


export const imgValidationLayer = (req, res, next) => {

    // check image exist
    if(!req.file) {return res.json({err: "image didn't uploaded"})};

    // check image size
    if(req.file.size >= 100*1024*1024){return res.json({err:"image size exceed 100mb"})};

    // everything OK
    next();    

}
