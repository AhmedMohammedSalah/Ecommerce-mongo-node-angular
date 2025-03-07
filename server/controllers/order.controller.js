import cartModel from "../database/models/cart.model.js";
import orderModel from "../database/models/order.model.js"; 
import jwt from "jsonwebtoken";
import { promoModel } from "../database/models/promotion.model.js";


/*
verify layer using joi need to be added on the order data on the request body
*/


/** function decrypt the token
 * 
 * @param: token: 
 * - Added: in header
 * - named: `token`
 * - contain: seller data
 * - goal: get seller id to be used in image path
 */
const decryptToken = (token) => {
    const key = "ARAF";
    try { return jwt.verify(token, key); }
    catch { return null; }
};

/** function to find promo by code
 * @param req - request object containing the promo code in body
 * @param res - response object
 * @return promo object if found and valid, otherwise null
 */
export async function findPromoByCode(req, res) {
    try {
        const { code } = req.body;
        const promo = await promoModel.findOne({ code });

        if (!promo) {
            res.status(404).json({ message: "Promo not found" });
            return null; // FIX: Return null explicitly
        }

        if (promo.validTo < Date.now()) {
            res.status(400).json({ message: "Promo expired" });
            return null; // FIX: Return null explicitly
        }

        return promo; // Return promo if valid

    } catch (error) {
        res.status(500).json({ message: "Error finding promo", error: error.message });
        return null; // FIX: Return null explicitly
    }
};

/** function to calculate total price after applying both item discounts and promo discount
 * @param cartItems: Array of cart items
 * - Each item contains { pid, price, discount, quantity }
 * - Applies item discount and multiplies by quantity
 * @param promoDiscount: Number (promo discount percentage)
 * @return final total price after applying all discounts
 */
const calculateTotalPrice = (cartItems, promoDiscount) => {
    let totalPrice = cartItems
        .map(item => (item.price * (1 - item.discount / 100)) * item.quantity)
        .reduce((sum, total) => sum + total, 0);

    return totalPrice * (1 - promoDiscount / 100);
};

/** function to create order
 * - Retrieves user cart
 * - Checks for promo code
 * - Calculates total price with discounts
 * - Inserts order into orderModel
 * - Returns final order details
 */
export const createOrder = async (req, res) => {

    let promoDiscount = 0;

    // DECRYPT TOKEN
    const userData = decryptToken(req.headers.token);

    // CHECK ROLE
    if (userData.role !== "user") {
        return res.json({ msg: "Account is not customer type" });
    }

    // GET USER CART
    const userCart = await cartModel.findOne({ userId: userData.id });

    // CHECK EXIST OR EMPTY
    if (!userCart || !userCart.items.length) {
        return res.json({ msg: "Cart not found or empty" });
    }

    // CHECK PROMO CODE
    if (userCart.promoCode) {

        // CHECK EXIST | VALID + GET IT
        const promo = await findPromoByCode({ body: { code: userCart.promoCode } }, res);

        if (promo && promo.discount) {
            promoDiscount = promo.discount;
        }
    }


    // CALCULATE TOTAL PRICE WITH ALL DISCOUNTS
    let finalTotalPrice = calculateTotalPrice(userCart.items, promoDiscount);



    // CREATE ORDER OBJECT
    const orderDetails = new orderModel({
        userId:             userData.id,
        items:              userCart.items,
        total:              finalTotalPrice,
        shippingAddress:    req.body.shippingAddress,
        paymentMethod:      req.body.paymentMethod,
        paymentId:          req.body.paymentId
    });


    // SAVE ORDER TO DATABASE
    const savedOrder = await orderDetails.save();
    res.json({ msg: "Order created successfully", order: savedOrder });


};