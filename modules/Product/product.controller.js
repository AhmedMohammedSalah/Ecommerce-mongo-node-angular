import { productModel } from '../../database/Models/product.model.js';

/** function just insert the data on product collection
 * + NOTE: rating will be added `[]` by default 
 */
export const storeProduct = async (req, res) => {

  // GET DATA FROM REQUEST BODY
  const data = req.body;

  // CHECK IF PRODUCT ALREADY EXISTS
  const foundProduct = await productModel.findOne({
      productName: data.productName,
      categoryId:  data.categoryId
  });

  if (foundProduct) {
    return res.json({ err: "Product already exists. Check name and category." });
  }

  // INSERT INTO DATABASE 
  const newProduct = new productModel(data);
  await newProduct.save();

  // final feedback
  res.json({ msg: "Product inserted successfully", newProduct });

};


/*
LOGIC:
------------------------------------------------------
insertOne() works directly with MongoDB.
 
This means:
❌ No Schema Validation 
❌ No Default Values (rating: [] won’t be auto-added)
❌ No Middleware Support (like pre and post hooks)
------------------------------------------------------
*/