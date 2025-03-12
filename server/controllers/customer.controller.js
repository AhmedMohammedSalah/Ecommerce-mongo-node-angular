import User from "../database/models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import customerModel from "../database/models/customer.model.js";
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

export const createCustomerProfile = async ( userID ) => {
    try {
        const user = await User.findById( userID );
        if ( !user ) {
            throw new Error( "User not found" );
        }
        const customer = new customerModel( { userId:userID } );
        await customer.save();
        return customer;
    } catch ( error ) {
        console.log(error);
        throw new Error( "Error creating customer profile", { cause: error } );
        
    }
}
export const createCart = (userID) => {
    const customer = customers.find(c => c.userID === userID);
    if (!customer) return null;

    customer.cart = [];
    return customer.cart;
}

export const updateCustomer = (req, res) => {
    const index = req.params.index;
    if (!customers[index])
        return res.status(404).json({ message: "Customer is Not Found" });

    customers[index] = req.body;
    res.json({ message: "Customer Updated Successfully" });
};
