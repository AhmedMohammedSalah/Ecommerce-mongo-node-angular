import fs, { stat } from "fs";
import jwt from "jsonwebtoken";
import productValidSchema from "../validators/productValidSchema.js";
import User from "../database/models/user.model.js"; // user model
import sellerModel from "../database/models/seller.model.js"; // seller profile
import adminModel from "../database/models/admin.model.js"; // admin profile

// for context
const userModel = User;

/** HELPER function check user exist
 * CONTEXT: coming from the token
 * @param:[userRole]: user role that found in token
 * @param:[userId]: user id that found in token
 * @param:[res]: response. <for errors if appear>
 */
const checkUserExist = async (userRole, userId) => {
  // whether admin or seller [different schemas]
  var sellerProfile = null;
  var err = null;

  // ADMIN
  if (userRole === "admin") {
    // get admin [admin profile model]
    sellerProfile = await adminModel.findById(userId);
  }

  // SELLER
  else if (userRole === "seller") {
    // get seller [seller profile model]
    sellerProfile = await sellerModel.findOne({ userId: userId });
  }

  // CHECK EXISTENCE
  if (!sellerProfile) {
    err = { msg: "verifyUser: checkUserExistence: seller in token not exist" };
  }

  // SEND ERROR [IF ANY] AND THE PROFILE
  return { err, sellerProfile };
};

/** function decrypt the token
 *
 * @param: token:
 * - Added: in header
 * - named: `token`
 * - contain: seller data
 * - goal: get seller id to be used in image path
 */
const decryptToken = (token, res) => {
  const key = "ARAF";
  try {
    return jwt.verify(token, key).user;
  } catch {
    return null;
  }
};

/** function verify the user coming in token, whether admin or seller
 */
export const verifyUser = async (req, res, next) => {
  // check token added on the header [DEV]
  if (!req.headers.token) {
    return res.json({ msg: "verifyUser: TOKEN NOT EXIST" });
  }

  // decrypt user data [token in header]
  const userData = decryptToken(req.headers.token, res);
  userData.id = userData._id;
  if (userData) {
    // CHECK ROLE
    if (userData.role === "admin" || userData.role === "seller") {
      // CHECK SELLER/ADMIN EXIST
      const status = await checkUserExist(userData.role, userData.id);

      // If an error exists, send a response
      if (status.err) {
        return res.json(status.err);
      }

      //--STORE--[ data + seller profile ]--later-use---
      req.userData = userData;
      req.sellerProfile = status.sellerProfile;
      //------------------------------------------------

      // everything is ok
      next();
    } else {
      return res.json({ msg: "verifyUser: UNAUTHORIZED ACCESS" });
    }
  } else {
    return res.json({ msg: "verifyUser: INVALID TOKEN" });
  }

  console.log(" add product : verifyUser: DONE"); //DEBUG

};

/** function store the image in `uploads/sellerId/`
 *
 * - steps: decypt token
 * - get sellerId + (add to data)
 * - add on the path
 * - store image
 * - add local path to the product data
 */
export const storeImg = (req, res) => {
  const userRole = req.userData.role;

  const dirPath =
    userRole == "admin" ? `uploads/admin` : `uploads/${req.userData.email}`; // check id or _id

  // CREATE IF PATH NOT EXIST
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });

    // IMAGE PATH
    // [AMS] ✅ Correct Naming
    const ext = String( req.file.originalname ).split( "." )[1];
  const imgPath = `${dirPath}/${req.body.productName}.${ext}`;

  // WRITE FILE TO DISK FROM BUFFER
  fs.writeFileSync(imgPath, req.file.buffer);

  //--ADD IMAGE PATH TO `req.body`--
  req.body.sellerId = req.userData.id;
  req.body.imagePath = imgPath;
  //--------------------------------

  // return that there is no message
  return false;
};

/** function validate image before storing by:
 *
 * - check if the image passed
 * - check image size
 * - then store it
 */
export const validateImg = (req, res) => {
  // check image exist
  if (!req.file) {
    return res.json({ err: "image didn't uploaded" });
  }

  // check image size
  const maxSize = 100 * 1024 * 1024;
  if (req.file.size >= maxSize) {
    return res.json({ err: "image size exceed 100mb" });
  }

  // store image
  storeImg(req, res);
};

/** function validate both ( product data + image uploaded )
 *
 * - convert data to object
 * - validate with JOI schema on data
 * - validate on the image using function
 */
export const validateProduct = (req, res, next) => {


  console.log("add product: validateProduct : entered"); //DEBUG

  // VALIDATE DATA
  //--------------

  // convert string to json object
  try {
    req.body = JSON.parse(req.body.data);
  } catch {
    return res.json({ error: "Invalid JSON" });
  } //DEV

  // check constraints + give all errors found
  const validation = productValidSchema.validate(req.body, {
    abortEarly: false,
  });

  // wrong constraint found
  if (validation.error) {

    console.log(validation.error); //DEBUG [IMPORTANT]

    res.status(400).json({
      errors: validation.error.details.map((err) => err.message),
    });

    return
  }

  console.log("add product: validateProduct: validate text data DONE"); //DEBUG

  // VALIDATE IMAGE + STORE
  //------------------------

  //-validate the image---
  const err = validateImg(req, res);

  if (err) {
    return err;
  } // to return the error
  //----------------------

  // everything ok
  next();


  console.log("add product: validateProduct : DONE"); //DEBUG
};
