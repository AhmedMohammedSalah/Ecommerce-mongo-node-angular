import { Schema, model } from "mongoose";

// shared
const str = { type: String, required: true, trim: true };
const num = { type: Number, required: true, min: 0 };

// schema
const productSchema = new Schema({
    productName:    { ...str, minlength: 3, maxlength: 100 },
    description:    { type: String, maxlength: 500 },
    price:          num,
    imagePath:      str, // AUTO ADDED: after uploading the image 
    categoryId:     str,
    sellerId:       str, // AUTO ADDED: from token <sellerID will be stored there>
    stockQuantity:  num,

    // rating: Array of numbers (0->5) 
    rating: { 
        type: [Number], 
        validate: {
            validator: (arr) => {return arr.every(n => n >= 0 && n <= 5);},
            message: "each rating must be between 0 and 5"
        },
        default: []
    }
},{ timestamps: true, versionKey: false });



// model
export const productModel = model("Product", productSchema);






