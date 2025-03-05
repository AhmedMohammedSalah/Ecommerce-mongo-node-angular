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
      sellerId: req.userData,
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
      { new: true, runValidators: true }
  );

  // FEEDBACK
  res.json({ msg: "Product updated successfully", product: updatedProduct });
};


//------------------------------------------------------

/** 
 * [DUPLICATED]function decypt the token
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

//-------------------------------------------------------

/*
expected token contain "user" info
if the user role admin , if the user role seller
remove the product (hard: seller), (soft: admin)
*/


/*
if user admin: remove soft
if user seller: check the product is owned to him (userid)
*/

export const deleteProduct = async (req, res) =>{

  // decypt token
  decryptToken(req.headers.token, res);

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