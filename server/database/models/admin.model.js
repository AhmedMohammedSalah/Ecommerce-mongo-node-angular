import { Schema, model } from "mongoose";


// [LOGIC]: here admin behave as a seller
// FREEDOM SPACE TO ADD ANYTHING RELATED TO ADMIN IN FUTURE

const adminSchema = Schema(
    {   
        // UID: FK
        _id: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        },

        // COMMERICAL INFO
        businessName: { type: String, required: true },
        businessDetails: { type: Object, required: true },
        bankDetails: { type: Object, required: true },

        // REVIEWS: reviews(txt) of customer to the admin as a seller
        reviews: [
            {
              customerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
              reviewTxt: { type: String },
              rating: { type: Number, required: true, min: 1, max: 5 }
            }
          ],


        // ADMIN PRODUCTS
        products: [{ type: Schema.Types.ObjectId, ref: 'Product', default: [] }],
        
        //ADMIN ORDERS FROM THE CUSTOMERS
        orders: { type: Array, default: [] },
        

    },

    {
    timestamps: true,
    versionKey: false,
    }
);


const adminModel = model("Admin", adminSchema)
export default adminModel



/* ADMIN DOCUMENT IN MONGO
------------------------------
[CHECK id or _id in the token]

{
  "_id": { "$oid": "67c7a3248c2b40de72c5a282" },
  "businessName": "Tech Solutions",
  "businessDetails": {
    "industry": "Electronics",
    "location": "Cairo, Egypt",
    "founded": 2020
  },
  "bankDetails": {
    "accountNumber": "123456789",
    "bankName": "National Bank",
    "IBAN": "EG123456789000"
  },
  "reviews": [
    {
      "customerId": { "$oid": "67c99e3368cfad3f8c151b73" },
      "reviewTxt": "Excellent service!",
      "rating": 5
    }
  ],
  "products": [],
  "createdAt": { "$date": "2024-03-06T00:00:00.000Z" },
  "updatedAt": { "$date": "2024-03-06T00:00:00.000Z" }
}
*/
