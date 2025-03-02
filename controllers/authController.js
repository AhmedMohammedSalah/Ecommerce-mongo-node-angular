import User from "../models/User.js";
import Seller from "../models/Seller.js";

export const signUp = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const newUser = new User({ name, email, password });
        await newUser.save();
        

        const newSeller = new Seller({
            userId: newUser._id,
            email: newUser.email, 
            businessName: `${name}'s Store`, 
            businessDetails: {},
            bankDetails: {},
            status: "pending"
        });

        await newSeller.save();

        res.status(201).json({ message: "User & Seller created successfully", user: newUser, seller: newSeller });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
