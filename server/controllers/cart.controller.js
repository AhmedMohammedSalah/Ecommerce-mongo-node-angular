import cartModel from "../database/models/cart.model.js";
import jwt from "jsonwebtoken";
import { productModel } from "../database/models/product.model.js";
/**
 * @description
 * This function is used to create a new shopping cart for a user.
 * It accepts the `userId` and `sessionId` in the request body.
 * If both `userId` and `sessionId` are provided, a new cart is created and saved to the database.
 * The function returns the created cart as a response.
 * @param req
 *  @param res
 * @edited by : [rehab kamal]
 *
 */
// for front end
export const createCart = async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res
        .status(400)
        .json({ message: "UserId and SessionId are required." });
    }

    const newCart = new cartModel({ sessionId });
    const savedCart = await newCart.save();

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
    const cart = await cartModel.findOne({ userId: req.user._id });
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

//-------READ--------------------------------------------------------------------------
// [SENU]: update cart also related to update the quantity of the product
// so checks need to make to check if the quantity less or equal the available product

// LACK THE CABABILITY OF INCREASING THE PRODUCT QUANTITY
//-------------------------------------------------------------------------------------
export const updateCart = async (req, res) => {
  try {
    let userId;
    if (req.user) userId = req.user._id;

    const { productId, quantity, sessionId } = req.body;

    // Find the product to check available stock
    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check stock availability
    if (quantity > product.availableStock) {
      return res.status(400).json({ message: "Insufficient stock available" });
    }

    // Determine query based on user type
    const query = userId
      ? { userId, "items.productId": productId }
      : { sessionId, "items.productId": productId };

    // Update cart with the new quantity
    const updatedCart = await cartModel.findOneAndUpdate(
      query,
      { $set: { "items.$.quantity": quantity } },
      { new: true }
    );

    if (!updatedCart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json({
      message: "Cart updated successfully",
      cart: updatedCart,
    });
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * @author Ahmed M.Salah
 * @param {*} req
 * @param {*} res
 * @return res.status( 200 ).json( { message: 'User set to cart successfully', cart } );
 */
export async function setUserToCart(req, res) {
  try {
    const userId = req.user._id;
    const { sessionId } = req.body;
    let cart = await cartModel.findOne({ sessionId });
    let userCart = await cartModel.findOne({ userId });
    if (userCart) {
      return res
        .status(400)
        .json({ message: "User already have a cart", userCart });
    }
    if (!cart) {
      console.log("enter if ");
      const newCart = new cartModel({ userId });
      await newCart.save();
      res
        .status(200)
        .json({ message: "User set to cart successfully", newCart });
    } else {
      console.log("enter else");
      cart.userId = userId;
      await cart.save();
      res.status(200).json({ message: "User set to cart successfully", cart });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
/*
SCENARIO:
clikcknig on the add-to-cart button below the product
at this case you have all product data becauses you fetch it to view the product already
*/

// [SENU]: add prodcut on the item array

// EXPECTED OUTCOME AS ELEMENT IN THE ITEM ARRAY
// [WILL BE USED IN THE ORDER SO I EXPECT TO FIND ARRAY OF OBJECT EACH OBJECT CONTAIN THIS]
//-----------------------------------------------------------------------------------------
// {productId: 'fsdfsdf', price: 1000,discount:: 12,quantity: default(1)}
//-----------------------------------------------------------------------------------------
export async function getCartBySession(req, res) {
  const { sessionId } = req.params;
  console.log(req.params);

  if (!sessionId) {
    return res.status(400).json({ message: "Session Id is required" });
  }
  const cart = await cartModel.findOne({ sessionId });
  if (!cart) {
    return res.status(400).json({ message: "Cart not found" });
  }
  console.log(cart);

  res.status(200).json(cart);
}
export async function addItemToCart(req, res) {
  console.log(req.body);
  // GET [PRODUCT-ID FROM REQUEST BODY [PID]
  // CHECK STOCKQUANTITY (NOT EQUAL ZERO)
  // DECRYPT TOKEN
  // CHECK USER ROLE [FROM TOKEN] [ONLY NORMAL USER HAS CART]
  // GET USER ID [FROM TOKEN]

  // USER ID TO GET CART

  // ACCESS ITEM ARRAY FROM CART AND PUSH {PID: PID, QUANTITIY: 1}

  // ELSE: INVALID TYPE OF USERS

  //ELSE : OUT-OF-STOCK

  // [AMS] this logic forget unsigned user
  try {
    let user = req.user;

    // Verify token if present
    if (req.headers["token"]) {
      try {
        const decoded = await jwt.verify(req.headers["token"], "ARAF");
        user = decoded.user;
      } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
      }
    }

    const userId = user?.id;
    const userRole = user?.role;
    const { sessionId, productId } = req.body;

    // Handle unsigned users
    if (!userId && !sessionId) {
      return res
        .status(400)
        .json({ message: "User ID or session ID is required" });
    }

    // Role check
    if (user && userRole !== "user") {
      return res
        .status(403)
        .json({ message: "Only normal users can have a cart" });
    }

    // Validate product ID
    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    // Find product
    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check product stock
    if (product.stockQuantity <= 0) {
      return res
        .status(400)
        .json({ message: "Product is out of stock or unavailable" });
    }

    // Find or create cart
    let cart;
    if (userId) {
      cart = await cartModel.findOne({ userId });
    } else if (sessionId) {
      cart = await cartModel.findOne({ sessionId });
    }

    if (!cart) {
      cart = new cartModel({ userId, sessionId, items: [] });
    }

    // Update cart items
    const existingCartItem = cart.items.find(
      (item) => item.productId.toString() === productId
    );

    if (existingCartItem) {
      existingCartItem.quantity++;
      await cart.save();
    } else {
      cart.items.push({
        productId: productId,
        price: product.price,
        discount: product.discount,
        quantity: 1,
      });
    }

    cart.markModified("items");
    await cart.save();

    return res
      .status(200)
      .json({ message: "Product added to cart successfully", cart });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error adding product to cart", error: error.message });
  }
}

// NOTE: WHEN ORDER MADE THE STOCK WILL BE REDUCES BASED ON THE AMOUNT IN THE ORDRER
// SO IF HE TRYING TO GET EVEN ONE AND THE STOCK IS EMPTY = 0 TELL THEM  "OUT-OF-STOCK"

// AND WHEN THE ORDER CANCELLED THE STOCK WILL INCREASE AGAIN [BUT THIS NOT YOUR BUSINESS]
export async function removeItemFromCart(req, res) {
  try {
    let user = req.user;

    // Verify token if present
    if (req.headers["token"]) {
      try {
        const decoded = await jwt.verify(req.headers["token"], "ARAF");
        user = decoded.user;
      } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
      }
    }

    const userId = user?.id;
    const userRole = user?.role;
    const { sessionId, productId } = req.body;

    // Handle unsigned users
    if (!userId && !sessionId) {
      return res
        .status(400)
        .json({ message: "User ID or session ID is required" });
    }

    // Role check
    if (user && userRole !== "user") {
      return res
        .status(403)
        .json({ message: "Only normal users can have a cart" });
    }

    // Validate product ID
    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    // Find or create cart
    let cart;
    if (userId) {
      cart = await cartModel.findOne({ userId });
    } else if (sessionId) {
      cart = await cartModel.findOne({ sessionId });
    }

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Find the item in the cart
    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    // Remove the item from the cart
    cart.items.splice(itemIndex, 1);

    // Mark the items array as modified
    cart.markModified("items");

    // Save the updated cart
    await cart.save();

    return res
      .status(200)
      .json({ message: "Product removed from cart successfully", cart });
  } catch (error) {
    return res.status(500).json({
      message: "Error removing product from cart",
      error: error.message,
    });
  }
}
export async function syncCart(req, res) {
    console.log("Request received:", req.body);
    console.log("User:", req.user);
  const { sessionId } = req.body;
  const user = req.user;

  if (!sessionId) {
    return res.status(400).json({ message: "Session ID is required" });
  }

  try {
    let cart = await cartModel.findOne({ userId: user._id });

      console.log("userId");
      console.log(cart);
    if (!cart) {
      // Check if a cart exists with sessionId
      cart = await cartModel.findOne( { sessionId } );
      
      console.log(cart);
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }
      // Assign the user ID and save
      console.log(cart);
      cart.userId = user._id;
      cart.sessionId = sessionId;
      await cart.save();
      return res
        .status(200)
        .json({ message: "Cart synced successfully", cart });
    } else {
      // User already has a cart, check if there's a session cart
      const sessionCart = await cartModel.findOne({ sessionId });

      if (sessionCart) {
        // Merge sessionCart items into user's cart
        sessionCart.items.forEach((sessionItem) => {
          const existingItemIndex = cart.items.findIndex(
            (item) =>
              item.productId.toString() === sessionItem.productId.toString()
          );

          if (existingItemIndex !== -1) {
            // If the item already exists, update the quantity
            cart.items[existingItemIndex].quantity += sessionItem.quantity;
          } else {
            // Otherwise, add the item
            cart.items.push(sessionItem);
          }
        });

        await cart.save();
        await cartModel.findByIdAndRemove(sessionCart._id); // Remove session cart

        return res
          .status(200)
          .json({ message: "Cart synced successfully", cart });
      }
    }

    return res.status(200).json({ message: "No session cart found", cart });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error syncing cart", error: error.message });
  }
}
