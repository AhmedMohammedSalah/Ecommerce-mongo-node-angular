import cartModel from "../database/models/cart.model.js";
import orderModel from "../database/models/order.model.js"; 
import jwt from "jsonwebtoken";
import { promoModel } from "../database/models/promotion.model.js";
import { productModel } from "../database/models/product.model.js";
import sellerModel from "../database/models/seller.model.js";
import adminModel from "../database/models/admin.model.js";
import customerModel from "../database/models/customer.model.js"



/*
working token
eyJhbGciOiJIUzI1NiJ9.eyJpZCI6IjY3Y2FmYzA1ZDI3M2NjMjg1YmIyYWU5ZiIsIm5hbWUiOiJtb2hhbWVkIGVsVXNlciIsImVtYWlsIjoibW9oYW1lZEVsVXNlckdkYW5AZXhhbXBsZS5jb20iLCJwYXNzd29yZCI6IlVzZXJQYXNzMTIzIiwicm9sZSI6InVzZXIiLCJpc1ZlcmlmaWVkIjp0cnVlLCJpc0RlbGV0ZWQiOmZhbHNlfQ.DVAUJPxKJGrOIIIY87gTou7RHshOj8NzLyxBVc65kww
*/


/*
target token
eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjp7Il9pZCI6IjY3Y2FmYzA1ZDI3M2NjMjg1YmIyYWU5ZiIsIm5hbWUiOiJtb2hhbWVkIGVsVXNlciIsImVtYWlsIjoibW9oYW1lZEVsVXNlckdkYW5AZXhhbXBsZS5jb20iLCJwYXNzd29yZCI6IlVzZXJQYXNzMTIzIiwicm9sZSI6InVzZXIiLCJpc1ZlcmlmaWVkIjp0cnVlLCJpc0RlbGV0ZWQiOmZhbHNlfX0.KoeBRFO5PFbtLUnUTCzl1e9wHEQqCpVAp3yNJ5yC1xo
// IMP INFO: find return the refernece to the order so it act at the original object

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




////////////////////////////////////////////////////////////////////////////

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


// DIVIDE ORDER INTO SELLER ORDERS AND STORE IT ON THEM
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

}


/** function to create order
 * - Retrieves user cart
 * - Checks for promo code
 * - Calculates total price with discounts
 * - Inserts order into orderModel
 * - Returns final order details
 */
export const createOrder = async (req, res) => {

    let promoDiscount = 0;

    const userData = req.user;

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























/** function: update the status */
function updateOrderStatus(sellerOrder, sellerData, customerOrder, userData, newStatus) {

    // Update seller order status
    sellerOrder.status = newStatus;
    sellerData.markModified("orders"); 
    sellerData.save(); 

    // Update customer order state list
    customerOrder.stateList.forEach(e => { if (e[userData.id]) {e[userData.id] = newStatus;} });
    customerOrder.markModified("stateList");
    customerOrder.save();

}


/* EXAMPLE IN THE BODY  
{
    oid: order id for the customer
    status: "Pending", "Processing", "Shipping", "Delivered", "Cancelled"
}
*/

// for sellers
export const updateDeliverStatus = async(req, res)=>{

    /*FIRST: GETTING ALL DATA YOU NEED
    -----------------------------------*/

    // body data
    const orderId = req.body.oid;       
    const newStatus = req.body.status   

    // decrypt token
    const userData = decryptToken(req.headers.token);
    if(!userData){res.json({msg:"updateDeliverStatus: user not exist, check id in the token"});  return; };



    // get seller profile
    var sellerData = await sellerModel.findOne({userId: userData.id});
    if(!sellerData){ sellerData =  await adminModel.findById(userData.id); }; // check it on admin profile
    if(!sellerData){ res.json({msg: "updateDeliverStatus: user is not a seller. check the token"}); return; }; // raise error


    // get seller order
    let sellerOrder = sellerData.orders.find(o => o.parentOrderId.equals(orderId));


    // get customer order
    const customerOrder = await orderModel.findById(orderId);
    if(!customerOrder){ res.json({msg:"order not exist. check id"}); return; }


    // get seller element in customerOrder for the seller
    var lastSellerOrderStatus = customerOrder.stateList.find(obj => obj[userData.id])?.[userData.id];


    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    //|||||||||| CANCEL ||||||||||
    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    if (newStatus == "Cancelled"){


        /* [ SHIPPED  |  DELIVERED ]: can't cancel
        ---------------------------------------------------------------*/
        if (["Shipped", "Delivered"].includes(lastSellerOrderStatus)) {
            res.json({msg:"TERMINATED: order cannot be cancelled at this stage"})
            return;
        }


        /* [ PROCESSING ]: increase stock + cancel
        ---------------------------------------------*/
        if (lastSellerOrderStatus == "Processing"){


            /* INCREASE STOCK
            -----------------------------------------*/
            for (const p of sellerOrder.products) { 

                // access inserted product
                const insertedProduct = await productModel.findById(p.pid);
                if (!insertedProduct) {res.json({ msg: "updateDeliverStatus: product not exist when trying to increase the stock" });  return;}
            
                // increase the quantity
                insertedProduct.stockQuantity += p.quantity;
                insertedProduct.save(); 
            }

            /* CANCEL: change status
            ----------------------------------*/
            updateOrderStatus(sellerOrder, sellerData, customerOrder, userData, newStatus);
            
            // FEEDBACK
            res.json({msg:"order cancelld successfully, stock increased"})
            //return;

        }

        // CANCEL + STOCK NO CHANGE
        if(lastSellerOrderStatus == "Pending"){

            // ONLY UPDATE STATUS
            updateOrderStatus(sellerOrder, sellerData, customerOrder, userData, newStatus);

            // FEEDBACK
            res.json({msg:"order cancelld successfully, stock no change"})
            //return;
        }

        res.json({msg:"TERMINATED: order already cancelled"})
        return;
    }



    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    //|||||||||| PROCESS ||||||||||
    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    else if(newStatus == "Processing"){

        /*[ SHIPPED - DELIVERED ]
        ------------------------------*/ //NO
        if(["Shipped", "Delivered"].includes(lastSellerOrderStatus)){
            res.json({msg:"TERMINATED: order now in higher stage. can't return to processing"});
            //return;
        }

        /*[ PENDING ] decrease stock + update status
        ----------------------------------------------*/ //OK
        if(["Pending","Cancelled"].includes(lastSellerOrderStatus)){


            /* DECREASE STOCK
            -----------------------------------------*/
            for (const p of sellerOrder.products) { 

                // access inserted product
                const insertedProduct = await productModel.findById(p.pid);
                if (!insertedProduct) {res.json({ msg: "updateDeliverStatus: product not exist when trying to increase the stock" });}
            
                // check quantity: 
                if(insertedProduct.stockQuantity < p.quantity){
                    res.json({msg:"TERMINATED: one of product out of stock."});
                    return;
                }
                
                // decrease the quantity
                insertedProduct.stockQuantity -= p.quantity;
                insertedProduct.save(); 
            }

            /* UPDATE STATUS
            ----------------------------------------------------------------------------*/
            updateOrderStatus(sellerOrder, sellerData, customerOrder, userData, newStatus);
            res.json({msg:"order processed successfully, stock decreased"})
            //return;


        }

        if(lastSellerOrderStatus=="Processing"){res.json({msg:"already Processing"}) };

    }


    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    //|||||||||| SHIPPED ||||||||||
    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    else if(newStatus == "Shipped"){

        /*[ PENDING ]: no, lower stage
        --------------------------------*/ //NO: LOWER STAGE
        if(lastSellerOrderStatus == "Pending"){
            res.json({msg:"TERMINATED: order, in very low stage to be shipped."})
            return;
        }

        /*[ PROCESSING ]:ok <change status>
        ------------------------------------*/  //OK
        if(lastSellerOrderStatus == "Processing"){

            // UPDATE STATUS    
            updateOrderStatus(sellerOrder, sellerData, customerOrder, userData, newStatus); 
            res.json({msg:"order shipped successfully"})
            //return;
            
        }
        

        /*[ DELIVERED ]: no, higher stage
        ------------------------------------*/ // NO: HIGHER STAGE
        if(lastSellerOrderStatus == "Delivered"){
            res.json({msg:"TERMINATED: already delivered"});
            return;
        }

        /*[ CANCELED ]:
        ------------------------------------*/ // CANNOT SHIP CANCELLED PRODUCT
        if(lastSellerOrderStatus == "Cancelled"){
            res.json({msg:"TERMINATED: can not ship cancelled product"});
            return;
        }

        if(lastSellerOrderStatus=="Shipped"){res.json({msg:"already Shipped"}) };
    }

    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    //|||||||||| DELIVERD |||||||||||
    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    else if(newStatus == "Delivered"){


        /*[ PENDING - PROCESSING ]: no, lower stages
        -------------------------------------------------*/
        if(["Pending", "Processing"].includes(lastSellerOrderStatus)){
            res.json({msg:"TERMINATED: lower stages to be delivered."});
            return;
        }

        /*[ CANCEL]: no, cannot deliver a cancelld order
        -------------------------------------------------*/
        if(lastSellerOrderStatus == "Cancelled"){
            res.json({msg:"TERMINATED: cannot deliver a cancelld order."});
            return;
        }


        /*[ SHIPPING ]: ok, <change status>
        ------------------------------------------------*/
        if(lastSellerOrderStatus == "Shipped"){

            // UPDATE STATUS    
            updateOrderStatus(sellerOrder, sellerData, customerOrder, userData, newStatus);
            res.json({msg:"order delivered successfully"})
            //return;

        }

        if(lastSellerOrderStatus=="Delivered"){res.json({msg:"already Delivered"}) };
    }


    else{ 
        res.json({msg:"wrong status."}); 
        return; 
    }




    //NOW CHANGE IT ON THE CUSTOMER STATUS

    // LOOP ON THEM [element on stateList in the order]:
    const statusPriority = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

    // default
    let foundStatus = "Cancelled"; 
    
    // PICK VALUE
    for (let priority of statusPriority) {

        // LOOP ON THEM ALL UNTIL FIND IT
        for (let e of customerOrder.stateList) {

            let value = Object.values(e)[0];

            if (value == priority) { 

                foundStatus = value;
                if (value === "Pending") break; 
            }
        }
        if (foundStatus === "Pending") break; 
    }
    
    // UPDATE THE STATUS FOR THE ORDER
    customerOrder.status = foundStatus;
    customerOrder.markModified("status");
    customerOrder.save();
    

}





















///////////////////READING///////////////////////



// export const getOrders =  async (req, res) =>{
    
//     // get user
//     const userData = 
    

// }