import cartModel from "../database/models/cart.model.js";
import orderModel from "../database/models/order.model.js"; 
import jwt from "jsonwebtoken";
import { promoModel } from "../database/models/promotion.model.js";
import { productModel } from "../database/models/product.model.js";
import sellerModel from "../database/models/seller.model.js";
import adminModel from "../database/models/admin.model.js";


// NEED TO BE DONE
/* verify layer using joi need to be added on the order data on the request body */


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


const getSellerByPID = async (PID) => 
    (await productModel.findById(PID).select("sellerId")).sellerId;


/**helper function take the itemscart and 
 * send the sellers and product in dictionary 
 * key is the seller id and the value is array of product
 * {"sid": [{},{}], "sid": [{}]} */
const collectSellersAndTheirProducts = async (items) => {

    const sellersProducts = {};

    for (const itm of items) {

        // seller id for the product [who sell it]
        const SID = await getSellerByPID(itm.pid); 

        // key: SID => value: [{Pinfo}]
        if (!sellersProducts[SID]) {sellersProducts[SID] = [];}
        sellersProducts[SID].push(itm);
    }

    return sellersProducts;
};


/** function: 
 * DIVIDE ORDER INTO SELLER ORDERS AND STORE IT ON THEM 
 
*/
const sendOrder2sellers = async(items, parentOrderId, UID) => {

    // provide unique sellers and its own products
    const sellersProducts = await collectSellersAndTheirProducts(items);

    // state list: [ {"sid": status}, {"sid": status} ] <for handling the shipping>
    let stateList = [];

    var findSeller;

    // to create and store the orders for each seller inside it
    for (const SID in sellersProducts) {

        // order that seller saw
        let sellerOrder = {
            userId: UID,                    // id of the user (customer)
            parentOrderId: parentOrderId,   // parent order id for the user
            products: sellersProducts[SID], // product for the seller that the user ordered
            status: "Pending"               // default status for the order once made
        }


        findSeller = await sellerModel.findOne({userId: SID});

        // if not exist in seller schema search on admin schema
        if(!findSeller){ findSeller = await adminModel.findById(SID)}

        // none of them : raise error
        if(!findSeller){return false}

        // add the order to the order array for the seller
        findSeller.orders.push(sellerOrder);
        await findSeller.save();

        // adding the state for the state list for the seller
        stateList.push({[SID]:"Pending"});

    }

    return stateList;

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

    // SEND THE ORDER TO THE SELLERS [DIVIDE IT INTO SMALL ORDERS]
    const stateList = await sendOrder2sellers(userCart.items, savedOrder._id, userData.id);

    if(!stateList){res.json({msg:"seller not exist"})}; 

    // add to stateList
    savedOrder.stateList = stateList;

    //save
    await savedOrder.save()
    res.json({ msg: "Order created, and the orders sent to the sellers successfully", order: savedOrder });

};


/////////////////////////////////////////////////////////////////////////
// [LOGIC] PARENT ORDER ID [MADE BY USER] is unique in the list of the orders

/*
{
    oid: order id for the customer
    status: "Pending", "Processing", "Shipping", "Delivered", "Cancelled"
}
*/


// for sellers
const updateDeliverStatus = async(req, res)=>{

    // body data
    const orderId = req.body.oid;       
    const newStatus = req.body.status   

    // decrypt token
    const userData = decryptToken(req.headers.token);
    if(!userData){res.json({msg:"updateDeliverStatus: user not exist, check id in the token"})};

    // get seller profile
    var sellerData = await sellerModel.findOne({userId: userData.id});
    if(!sellerData){ sellerData =  await seller.findById(userData.id); }; // check it on admin profile
    if(!sellerData){ res.json({msg: "updateDeliverStatus: user is not a seller. check the token"}); }; // raise error

    // get customer order
    const customerOrder = await orderModel.findById(orderId);
    if(!customerOrder){ res.json({msg:"order not exist. check id"})}

    // if status cancel
    if (newStatus == "Cancelled"){

        // access seller element in customerOrder for the seller
        const lastSellerOrderStatus = customerOrder.stateList.find(obj => obj[userData.id])?.[userData.id];

        //  can't cancel the order
        if (["Shipped", "Delivered"].includes(lastSellerOrderStatus)) {
            res.json({msg:"order cannot be cancelled at this stage"})
        }
    }

    // access the order stored on seller using orderId


    // STATUS WHEN THE STOCK INCREASE OR DECREASE

    /* if newStatus == "Cancelled"{

        access product by pid from the accessed order

        access quantity needed

        access stock quantity in the product

        increase on what exist because it cancelled
    }

    else if (newStatus == "Processing"){

        access product by pid from the accessed order

        access quantity needed

        access stock quantity in the product

        decrease on what exist because it take from the storage
    }


    // NOW CHANGE THE STATUS IN THE ORDER STORED WHATEVER THE STAGE

    //NOW CHANGE IT ON THE CUSTOMER STATUS

    // LOOP ON THEM:

        // IF       PENDING FOUND => CUSTOMERORDER.STATUS = PENDING
        // ELSE IF  PROGRESS FOUND => CUSTOMERORDER.STATUS = PROGRESS
        // ELSE IF SHIPPED FOUND  => CUSTOMERORDER.STATUS = SHIPPED
        // ELSE IF DELIVIED FOUND => CUSTOMERORDER.STATUS = DELIVERED
        // ELSE IF CANCEL FOUND  => CUSTOMERORDER.STATUS = CANCELLED

*/


    
    

}
