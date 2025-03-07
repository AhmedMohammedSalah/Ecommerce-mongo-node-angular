import User from "../database/models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

let customers = [];

export const createCustomer = (req, res) => {
    customers.push(req.body);
    res.json({ message: "Customer Added Successfully" });
};

export const updateCustomer = (req, res) => {
    const index = req.params.index;
    if (!customers[index])
        return res.status(404).json({ message: "Customer is Not Found" });

    customers[index] = req.body;
    res.json({ message: "Customer Updated Successfully" });
};
