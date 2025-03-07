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

//-------READ--------------------------------------------------------------------------
// [SENU]: update cart also related to update the quantity of the product
// so checks need to make to check if the quantity less or equal the available product

// LACK THE CABABILITY OF INCREASING THE PRODUCT QUANTITY
//-------------------------------------------------------------------------------------
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

export const addItemToCart = async ( req, res) => {

  // GET [PRODUCT-ID FROM REQUEST BODY [PID]

  // CHECK STOCKQUANTITY (NOT EQUAL ZERO)

    // DECRYPT TOKEN

    // CHECK USER ROLE [FROM TOKEN] [ONLY NORMAL USER HAS CART]

      // GET USER ID [FROM TOKEN]

      // USER ID TO GET CART

      // ACCESS ITEM ARRAY FROM CART AND PUSH {PID: PID, QUANTITIY: 1}

    // ELSE: INVALID TYPE OF USERS
  
  //ELSE : OUT-OF-STOCK
  
}



// NOTE: WHEN ORDER MADE THE STOCK WILL BE REDUCES BASED ON THE AMOUNT IN THE ORDRER
// SO IF HE TRYING TO GET EVEN ONE AND THE STOCK IS EMPTY = 0 TELL THEM  "OUT-OF-STOCK"

// AND WHEN THE ORDER CANCELLED THE STOCK WILL INCREASE AGAIN [BUT THIS NOT YOUR BUSINESS]