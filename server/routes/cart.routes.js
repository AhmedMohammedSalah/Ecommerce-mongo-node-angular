import { Router } from "express";
import {
  createCart,addItemToCart,
  getCartByUserId,
  setUserToCart,removeItemFromCart,
  updateCart,
} from "../controllers/cart.controller.js";
import { tokenVerify } from "../middleware/tokenVerify.js";

const cartRoutes = Router();

// Create new cart

// [AMS] => :id means session id
cartRoutes.post("/cart/:sessionId", createCart);

// Get cart by userId
cartRoutes.get("/cart/",tokenVerify, getCartByUserId);

// Update cart
cartRoutes.put("/cart/", updateCart);

cartRoutes.put( "/cart/set-user/", tokenVerify, setUserToCart );

cartRoutes.post( "/addtocart", addItemToCart );

cartRoutes.post("/removefromcart", removeItemFromCart);
export default cartRoutes;
