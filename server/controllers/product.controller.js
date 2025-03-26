import adminModel from "../database/models/admin.model.js";
import { productModel } from "../database/models/product.model.js";
import sellerModel from "../database/models/seller.model.js";
import User from "../database/models/user.model.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { catModel } from "../database/models/category.model.js";

// FOR CONTEXT [SENU COMMENT]
const userModel = User;

/** function: ADD PRODUCT FOR  ADMIN/SELLER
 * USED: sellers schema, admin schema
 */
export const addProduct = async (req, res) => {
  // GET DATA FROM REQUEST BODY
  const data = req.body;

  // CHECK IF PRODUCT ALREADY EXISTS
  const foundProduct = await productModel.findOne({
    productName: data.productName,
    categoryId: data.categoryId,
    sellerId: req.userData.id, // <error fixed here>
  });

  // MESSAGE
  if (foundProduct) {
    return res.json({
      err: "Product already exists. Check name and category.",
    });
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
    return res.json({
      msg: "At least one attribute must be provided for update",
    });
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
export const hardDelProduct = async (req, res) => {
  // get id from URL
  const PID = req.params.id;

  // find and delete
  const deletedProduct = await productModel.findByIdAndDelete(PID);

  // feedback
  res.json({ msg: "product deleted from DB" });
};

/** function: return all products */
export const getAllProducts = async (req, res) => {
  const products = await productModel.find();
  res.json(products);
};

// [SOFT-DELETE ADDED] [SENU]
/** function to search products by names [regex]*/
export const searchProductsByName = async (req, res) => {
  // get name from url
  const name = req.params.name;

  // get products [regex] : try to extract whatever the word from anywhere in the product name
  const products = await productModel.find({
    productName: { $regex: `.*${name}.*`, $options: "i" },
    isDeleted: { $ne: true },
  });

  // feedback
  res.json(products);
};

//[SOFT-DELETE ADDED] [SENU]
/** function search products by price */
export const searchProductsByPrice = async (req, res) => {
  // get from url
  let min = Number(req.params.min) || 0;
  let max = Number(req.params.max) || Infinity;

  // handling issue [no worries]
  if (min > max) {
    [min, max] = [max, min];
  }

  // filter and get
  const products = await productModel.find({
    price: { $gte: min, $lte: max },
    isDeleted: { $ne: true }, //<========================SOFTING-DELETED
  });

  //feedback
  res.json(products);
};

//[SOFT DELETE ADDED] [SENU]
/**function to search be category based on endpoint naming and url variable */
export const searchProductsByCategory = async (req, res) => {
  // get category ID  [url]
  const { categoryId } = req.params;

  // get products -> category ID
  const products = await productModel.find({
    categoryId: categoryId,
    isDeleted: { $ne: true },
  }); //<<<======SOFT-DELETE

  // feedback
  res.json(products);
};

/**logic thinking:
 * ---------------
 * check if the product is requested inside order):
 * and the status on stateList for seller ownerProduct IS NOT [DELIVERED or CANCELLED] then
 * if the product is requested in order you can remove it  [NO, CAN'T BE REMOVED]
 *
 *
 * why delivered and cancelled because here the product already decreased from the existed stock
 * and reached to the customer or put on the store again so, now if the seller need to remove his own
 * products its ok
 *
 */

/** fnction get admin products he added, HARDCODE ID INSIDE THE FUNCTION */
export const getAdminProducts = async (req, res) => {
  // hard code id-----------------------------
  let adminId = "67c7a3248c2b40de72c5a282";
  // ---------------------------------------------------------------------
  // [AMS] it didn't right to make admin id as a hard coded            ||
  // [AMS] the best way is to pass it as it through token              ||
  // --------------------------------------------------------------------
  // [AMS] 🫰🏻 update the code to get admin id from token if exsist     ||
  // --------------------------------------------------------------------
  if (req.headers["token"]) {
    jwt.verify(req.headers["token"], "ARAF", (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid token" });
      }
      if (decoded.user.role != "admin") {
        return res.status(401).json({ message: "unauthorized" });
      }
      adminId = decoded.user._id;
    });
  }
  // get admin
  const admin = await userModel.findById(adminId);
  if (!admin) return res.json({ error: "Admin not found, check ID" });

  // get products
  const prodctsIDs = admin.products;

  // get them from products
  const productsData = await productModel.find({ _id: { $in: prodctsIDs } });

  // output
  res.json(productsData);
};

// [SOFT DELETE ADDED : SENU]
/** function to get the seller product for all user, admin and the seller(made for them) */
export const getSellerProducts = async (req, res) => {

  console.log("getSellerProducts : entered"); //debug

  // get id (for user/seller)
  let sellerId = req.params.sellerId;
  // --------------------------------------------------------------------
  // [AMS] 🫰🏻 update the code to get seller id from token if it's exsists  |
  // --------------------------------------------------------------------

  console.log("[SALAH]seller id got from params = ", sellerId); //deubg

  if (req.headers["token"]) {
    jwt.verify(req.headers["token"], "ARAF", (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid token" });
      }
      sellerId = decoded.user._id;
    });
  }

  console.log("[header] seller id from token again I don't know why  =", sellerId );//debug

  // get admin
  const seller = await sellerModel.findOne({ userId: sellerId });
  if (!seller) return res.json({ error: "Seller not found, check ID" });


  // get products
  const prodctsIDs = seller.products;

  // get them from products (excluding soft-deleted ones)
  const productsData = await productModel.find({
    _id: { $in: prodctsIDs },
    isDeleted: { $ne: true }, //<<==========================SOFTING DELETE
  });

  // output
  res.json(productsData);
};

// [RECENTLY ADDED]

/** function: get product by id
 *  @param: ON URL: product id
 * @returns Promise
 */

export const getProductById = async (req, res) => {
  const PID = req.params.id;

  // check object ID format [important]
  if (!mongoose.Types.ObjectId.isValid(PID)) {
    return res.status(400).json({ err: "invalid ID format." });
  }

  const findProduct = await productModel.findById(PID);
  const category = await catModel.findById(findProduct.categoryId);
  if (!findProduct)
    return res.status(404).json({ err: "product not found. check ID." });
  const productWithCategory = {
    ...findProduct.toObject(),
    category: category || null,
  };

  res.json(productWithCategory);
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
export async function getProductsByIds(req, res) {
  const { ids } = req.body;
  try {
    const products = await productModel.find({ _id: { $in: ids } });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products" });
  }
}
