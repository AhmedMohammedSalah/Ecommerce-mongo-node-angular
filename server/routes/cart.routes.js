import { Router } from "express";
import {
  createCart,
  getCartByUserId,
  updateCart,
} from "../controllers/cart.controller.js";

const cartRoutes = Router();
cartRoutes.get("/cart", (req, res) => {
  res.send("welcome into cart ");
});
// Create new cart


cartRoutes.post("/cart/:id", createCart);

// Get cart by userId
cartRoutes.get("/cart/:userId", getCartByUserId);

// Update cart
cartRoutes.put("/cart/update/:userId", updateCart);

export default cartRoutes;
