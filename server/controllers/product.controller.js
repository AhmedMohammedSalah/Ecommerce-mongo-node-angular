import adminModel from '../database/models/admin.model.js';
import { productModel } from '../database/models/product.model.js';
import sellerModel from '../database/models/seller.model.js';
import  jwt  from 'jsonwebtoken';



/*
IN READING PRODUCT
NEED TO FILTER THE SOFT DELETED PRODUCT AND THE OUT-OF-STOCK
*/


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

/** function: return all products */
export const getAllProducts = async (req, res) => {

    const products = await productModel.find();
    res.json(products);

};

/** function to search products by names [regex]*/
export const searchProductsByName = async (req, res) => {

  // get name from url
  const name = req.params.name;

  // get products [regex] : try to extract whatever the word from anywhere in the product name
  const products = await productModel.find({ productName: { $regex: `.*${name}.*`, $options: "i" }});

  // feedback
  res.json(products);
};


/** function search products by price */
export const searchProductsByPrice = async (req, res) => {

  // get from url
  let min = Number(req.params.min) || 0;
  let max = Number(req.params.max) || Infinity;

  // handling issue [no worries]
  if (min > max) {[min, max] = [max, min];}

  // filter and get
  const products = await productModel.find({
    price: { $gte: min, $lte: max }
  });

  //feedback
  res.json(products);
};

/**function to search be category based on endpoint naming and url variable */
export const searchProductsByCategory = async (req, res) => {

  // get category ID  [url] 
  const { categoryId } = req.params;

  // get products -> category ID
  const products = await productModel.find({ categoryId: categoryId });

  // feedback
  res.json(products);
};

/** fnction get admin products he added, HARDCODE ID INSIDE THE FUNCTION */
export const getAdminProducts = async (req, res)=> {

  // hard code id-----------------------------
  const adminId = "67c7a3248c2b40de72c5a282";
  //------------------------------------------

  // get admin
  const admin = await adminModel.findById(adminId);
  if (!admin) return res.json({ error: "Admin not found, check ID" });

  // get products
  const prodctsIDs  = admin.products;

  // get them from products
  const productsData = await productModel.find({ _id: { $in: prodctsIDs } });

  // output
  res.json(productsData);

};

/** function to get the seller product for all user, admin and the seller(made for them) */
export const getSellerProducts = async (req, res) =>{
  // get id (for user/seller)
  let sellerId = req.params.sellerId;
  // --------------------------------------------------------------------
  // [AMS] 🫰🏻 update the code to get seller id from token if it's exsists  |
  // --------------------------------------------------------------------
  if (req.headers["token"]) {
    jwt.verify(req.headers["token"], "ARAF", (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid token" });
      }
      sellerId = decoded.user._id;
    });
  }
  // get admin
  const seller = await sellerModel.findOne({ userId: sellerId });
  if (!seller) return res.json({ error: "Seller not found, check ID" });

  // get products
  const prodctsIDs = seller.products;

  // get them from products
  const productsData = await productModel.find({ _id: { $in: prodctsIDs } });

  // output
  res.json(productsData);
};






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