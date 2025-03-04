import { productModel } from '../database/models/product.model.js';

/** function just insert the data on product collection
 * + NOTE: rating will be added `[]` by default 
 */
export const addProduct = async (req, res) => {

  // GET DATA FROM REQUEST BODY
  const data = req.body;

  // CHECK IF PRODUCT ALREADY EXISTS
  // LOGIC: same name, same category, same seller
  const foundProduct = await productModel.findOne({
      productName: data.productName,
      categoryId:  data.categoryId,
      sellerId: data.sellerId
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


/**
 * function update attributes based on what given in the body
 * at least one attribute
 */
export const updateProduct = async (req, res) => {

  const productId = req.params.id;
  const updates = req.body;

  // CHECK EMPTY DATA 
  if (Object.keys(updates).length === 0) {
      return res.json({ msg: "At least one attribute must be provided for update" });
  }

  // UPDATE
  const updatedProduct = await productModel.findByIdAndUpdate(
      productId, 
      { $set: updates }, 
      { new: true, runValidators: true } // Return updated product and validate fields
  );

  // FEEDBACK
  res.json({ msg: "Product updated successfully", product: updatedProduct });
};


//------------------------------------------------------

export const deleteProduct = async (req, res) =>{

  // get id from URL
  const PID = req.params.id;

  // find and delete
  const deletedProduct = await productModel.findByIdAndDelete(PID);

  // check existence
  if(deletedProduct){
    res.json({msg: "DELETED SUCESSFULLY", product: deletedProduct });
  }
  else{
    res.json({msg: "PRODUCT NOT EXIST"});
  }

}