import { productModel } from '../../database/Models/product.model.js';


export const storeProduct = (req, res) => {

  console.log("storeProduct : req.body: ", req.body);
  console.log("storeProduct : req.file: ", req.file);
}




































//---------------------------FUCK----------------------------------------

/*




//--[SIMULATION]---seller ID from token--------
const sellerId = "67bde250bd09384a7ccb190d";
//--------------------------------------------

// Add a new product
export const storeProduct = async (req, res) => {


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
    data.sellerId = sellerId;

    // ACTUAL INSERTION INTO DATABASE
    const insertedProduct = await productModel.create(data);
    res.json({ msg: "Product inserted successfully", insertedProduct });

};

*/