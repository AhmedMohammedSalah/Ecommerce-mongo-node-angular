import cartModel from "../database/models/cart.model.js";
/**
 * @description
 * This function is used to create a new shopping cart for a user.
 * It accepts the `userId` and `sessionId` in the request body.
 * If both `userId` and `sessionId` are provided, a new cart is created and saved to the database.
 * The function returns the created cart as a response.
 *
 * @edited by : [rehab kamal]
 */
// userID 
export const createCart = async ( req, res ) => {
  try {
    const {sessionId } = req.params.id;

    if (!userId || !sessionId) {
      return res
        .status(400)
        .json({ message: "UserId and SessionId are required." });
    }

    const newCart = new cartModel({ userId, sessionId });
    const savedCart = await  newCart.save();

    res.status(201).json(savedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @description
 * This function retrieves the shopping cart associated with the given userId.
 * It queries the database to find the cart for the provided `userId`.
 * If the cart is found, it is returned as a response, otherwise an error message is sent.
 *
 * @edited by : [rehab kamal]
 */
export const getCartByUserId = async (req, res) => {
  try {
    const cart = await cartModel.findOne({ userId: req.params.userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @description
 * This function is used to update the shopping cart of a user.
 * It finds the cart by `userId` and updates it with the new data provided in the request body.
 * If the cart is successfully updated, the updated cart is returned, otherwise, an error message is sent.
 *
 * @edited by : [rehab kamal]
 */
export const updateCart = async (req, res) => {
  try {
    const updatedCart = await cartModel.findOneAndUpdate(
      { userId: req.params.userId },
      { $set: req.body },
      { new: true }
    );

    if (!updatedCart)
      return res.status(404).json({ message: "Cart not found" });

    res
      .status(200)
      .json({ message: "Cart updated successfully", cart: updatedCart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addItemToCart = async ( req, res, productId ) => {
  
}

