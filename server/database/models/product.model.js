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
    discount: {type: Number, min: 0, max: 100, default: 0}, //NEWLY ADDED [DISCOUNT LOGIC]

    // REVIEWS:  review for each customer on the produt contain the txt and the rating
    reviews: [
        {
          customerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
          reviewTxt: { type: String },
          rating: { type: Number, required: true, min: 1, max: 5 }
        }
      ],

},{ timestamps: true, versionKey: false });



// model
export const productModel = model("Product", productSchema);





//{"productName": "Apple iPhone 15", "description": "The latest iPhone model.", "price": 999, "categoryId": "65f2c4b8a1e3d6f8d3a7b5c9", "stockQuantity": 50}
  
