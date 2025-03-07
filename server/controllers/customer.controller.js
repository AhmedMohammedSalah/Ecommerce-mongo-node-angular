import User from "../database/models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

let customers = [];

export const createCustomerProfile = (userID) => {
    const customer = {
        userID,
        name: "Default Name",
        email: "default@email.com",
        cart: []
    };
    customers.push(customer);
    return customer;
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
