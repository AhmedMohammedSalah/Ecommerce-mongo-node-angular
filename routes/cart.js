import express from "express";
import { createCart, getCartByUserId, updateCart } from "../controllers/cartController.js";

const cartrouter = express.Router();

// Create new cart
cartrouter.post("/create", createCart);

// Get cart by userId
cartrouter.get("/:userId", getCartByUserId);

// Update cart
cartrouter.put("/update/:userId", updateCart);

export default cartrouter;
