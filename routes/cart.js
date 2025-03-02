import express from "express";
import Cart from "../models/Cart.js";

const router = express.Router();

/**
 *  @description : This function is used to creat new  cart.
 *  @returns :  Cart object.
 *  rehab kamal
 *  @date : 2022-02-01
 *  @postman_link  http://localhost:3000/carts/create

 */
router.post("/create", async (req, res) => {
  try {
    const { userId, sessionId } = req.body;

    const newCart = new Cart({ userId, sessionId });
    const savedCart = await newCart.save();

    res.status(201).json(savedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


/**
 *  @description : This function is used to get all carts by user_id .
 *  @returns :  Cart object.
 *  rehab kamal
 *  @date : 2022-02-01
 *  @postman_link  http://localhost:3000/carts/user_id

 */

router.get("/:userId", async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


/**
 *  @description : This function is used to update   cart.
 *  @returns :  Cart object.
 *  rehab kamal
 *  @date : 2022-02-01
 *  @postman_link  http://localhost:3000/carts/update/user_id

 */
router.put("/update/:userId", async (req, res) => {
  try {
    const updatedCart = await Cart.findOneAndUpdate(
      { userId: req.params.userId },
      { $set: req.body },
      { new: true }
    );

    if (!updatedCart) return res.status(404).json({ message: "Cart not found" });

    res.status(200).json({ message: "Cart updated successfully", cart: updatedCart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
