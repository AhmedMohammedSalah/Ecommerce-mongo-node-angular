import productValidSchema from "../Validator/productValidSchema.js";


//-------------------------

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



export const storeImg = (req)=>{
    
    // decrypt token to get seller id
    const data = decyptToken(req.headers.token);

    // extract seller id + add on path
    const sellerId = data.sellerId;
    const imgPath = `uploads/${sellerId}`;
    
    // create if file not exist
    if(!fs.existsSync(imgPath))
        fs.mkdirSync(imgPath,{recursive:true});

    // ACTUAL STORE IMAGE
    const upload = multer({ dest: imgPath }).single("productImg"); 

    upload(req, null, (err) => {
        if (err) return console.log("Multer error:", err);

        // ADD image path in product data
        req.body.imagePath = `${imgPath}/${req.file.filename}`;
    });

}


export const validateImg = (req, res) => {

    // check image exist
    if(!req.file) {return res.json({err: "image didn't uploaded"})};

    // check image size
    const maxSize = 100*1024*1024;
    if(req.file.size >= maxSize){return res.json({err:"image size exceed 100mb"})};

    // store image
    storeImg(req);

}
//-------------------------




export const validateProductLayer = (req, res, next) =>{

    // convert string to json object
    const data = JSON.parse(req.body.data);

    // check constraints + give all errors found
    const validation = productValidSchema.validate(data, {abortEarly: false});

    // wrong constraint found
    if(validation.error){

        return res.status(400).json({
            errors: validation.error.details.map(err => err.message)
        })
    }

    //-validate the image-------
    validateImg(req,res);
    //-------------------------

    // everything ok
    next();

}