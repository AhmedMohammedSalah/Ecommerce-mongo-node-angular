import User from "../database/models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import customerModel from "../database/models/customer.model.js";
import { log } from "console";
// [AMS] 🤦 the following code is useless (didn't have any logic )
// let customers = [];

// export const createCustomerProfile = (userID) => {
//     const customer = {
//         userID,
//         name: "Default Name",
//         email: "default@email.com",
//         cart: []
//     };
//     customers.push(customer);
//     return customer;
// }

/**
 * @author Ahmed M.Salah
 * @param {ObjectId} userID
 * @returns customer Profile
 */
export const createCustomerProfile = async (userID) => {
  try {
    const user = await User.findById(userID);
    if (!user) {
      throw new Error("User not found");
    }
    const customer = new customerModel({ userId: userID });
    await customer.save();
    return customer;
  } catch (error) {
    console.log(error);
    throw new Error("Error creating customer profile", { cause: error });
  }
};
// [AMS] 🤦 the following code is useless (didn't have any logic )

// export const createCart = (userID) => {
//     const customer = customers.find(c => c.userID === userID);
//     if (!customer) return null;

//     customer.cart = [];
//     return customer.cart;
// }
// export const updateCustomer = (req, res) => {
//     const index = req.params.index;
//     if (!customers[index])
//         return res.status(404).json({ message: "Customer is Not Found" });

//     customers[index] = req.body;
//     res.json({ message: "Customer Updated Successfully" });
// };

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns res.json({ message: "customer updated successfully", updatedCustomer });
    
}
 */
export async function updateCustomer(req, res) {

  const userId = req.user._id;
  const customer = await customerModel.findOne({ userId });

  if (!customer) return res.status(404).json({ message: "customer not found" });
  console.log(customer._id);

  const updatedCustomer = await customerModel.findByIdAndUpdate(
    customer._id,
    req.body,
    { new: true }
  );

  res
    .status(200)
    .json({ message: "customer updated successfully", updatedCustomer });
}
