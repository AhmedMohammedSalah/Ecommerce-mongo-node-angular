import { productModel } from '../../database/Models/product.model.js';
import multer from 'multer';
import fs from "fs"


/**
 * [IN MIDDLEWARE]:
 * store uploaded image in 'uploads/' dir 
 */
const storeImg = (sellerID) =>{

    // CREATE PATH IF NOT EXIST:
    const path = `uploads/${sellerID}`
    if(!fs.existsSync(path)){
        fs.mkdirSync(path, { recursive: true });
    }
        
    // STORAGE: 
    const storage = multer.diskStorage({
    
        // PATH
        destination: function (req, file, cb) {
            cb(null, path) 
        },
    
        // NAMING
        filename: function (req, file, cb) {
            cb(null, file.originalname)
        }
    
    })

    // RETURN: image path
    return multer({ storage });

}


//--[SIMULATION]---seller ID from token--------
const sellerID = "67bde250bd09384a7ccb190d"
//--------------------------------------------

/**
 * add product data
*/
export const storeProduct = async (req, res) => {

  const data = await req.body;

  // CHECK EXIST:based on name and category
  const foundProduct = await findOne({productName: data.productName, categoryId: data.categoryId});

  if(foundProduct){
    return res.status(409).json({err: "product exist. check name and category"});
  }
  else{

    // ADD: imgPath + sellerID
    data.sellerID = sellerID;
    data.imagePath = storeImg(sellerID);


    // actual insertion
    productModel.insertOne(data)
    .then(insertedProduct=> res.json({msg:"INSERTED SUCCESSFULLY", insertedProduct: insertedProduct}))
    .catch(err=>res.json({err:err}))

  }

}

