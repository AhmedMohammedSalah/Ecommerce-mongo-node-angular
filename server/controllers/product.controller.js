import { productModel } from '../database/models/product.model.js';


/** function: ADD PRODUCT FOR  ADMIN/SELLER
 * USED: sellers schema, admin schema
*/
export const addProduct = async (req, res) => {

  // GET DATA FROM REQUEST BODY
  const data = req.body;

  // CHECK IF PRODUCT ALREADY EXISTS
  const foundProduct = await productModel.findOne({
      productName: data.productName,
      categoryId:  data.categoryId,
      sellerId: req.userData.id, // <error fixed here>
  });

  // MESSAGE
  if (foundProduct) {
    return res.json({ err: "Product already exists. Check name and category." });
  }


  // INSERT INTO DATABASE 
  const newProduct = new productModel(data);
  await newProduct.save();


  // STORE PRODUCT FOR  ADMIN/SELLER
  req.sellerProfile.products.push(newProduct._id);
  await req.sellerProfile.save();

  
  // final feedback
  res.json({ msg: "Product inserted successfully", newProduct });

};


/** function update attributes based on what given in the body
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


/** function to hard delete the prodct: remove it from db
 * @param: on URL: you need to add the product id to delete
*/
export const hardDelProduct = async (req, res) =>{

  // get id from URL
  const PID = req.params.id;

  // find and delete
    const deletedProduct = await productModel.findByIdAndDelete(PID);

  // feedback
  res.json({msg:"product deleted from DB"});
};



export const getProductbyId = async (req, res) => {

}

/* LOGIC: usage of save instead of insertOne
------------------------------------------------------
insertOne() works directly with MongoDB.
 
This means:
❌ No Schema Validation 
❌ No Default Values (rating: [] won’t be auto-added)
❌ No Middleware Support (like pre and post hooks)
------------------------------------------------------
*/


/*TRASH:
/** function to delete prodct soft: will not appear to the user but stored in db 
 * @param: on URL: you need to add the product id to delete
export const softDelProduct = async (req, res) => {

  // get id from URL
  const PID = req.params.id;

  // find and update [Deleted]
  await Model.findByIdAndUpdate(PID, { $set: { isDeleted: true } });

  // feedback
  res.json({msg:"product cannot be seen by customers"});
  
};
*/