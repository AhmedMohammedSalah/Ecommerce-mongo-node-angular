import cartModel from "../database/models/cart.model.js";
import jwt from "jsonwebtoken"


/** function decrypt the token
 * 
 * @param: token: 
 * - Added: in header
 * - named: `token`
 * - contain: seller data
 * - goal: get seller id to be used in image path
 */
const decryptToken = (token) =>{

    const key = "ARAF";
    try   { return jwt.verify(token, key) }
    catch { return null }
};


/*
LOGIC:
it will be function or endpoint
for now I will make it  as endpoint for testing  on postman
'to convert it to function jus we will path user id instead of taking from the token and
the response will be a message returned'
*/


// ITEM ARRAY WILL CONTAIN: 
// {PID:value, PRICE:value, DISCOUNT:value, QUANTITY:value}

export const createOrder = async(req, res)=>{


    // DECRYPT TOKEN
    const userData = decryptToken(req.headers.token);

    // CHECK ROLE
    if(userData.role == "user"){

        // GET USER CART
        const userCart = await cartModel.findOne({userId: userData.id});
        if(!userCart){ res.json({msg:"cart not found"})} //IF NOT EXIST

        // ITEMS ARRAY
        const items = userCart.items;

        

    }
    else{res.json({msg:"account is not customer type"});}

    

}