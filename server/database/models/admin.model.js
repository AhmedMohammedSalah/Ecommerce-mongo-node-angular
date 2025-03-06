
// [LOGIC]: here admin behave as a seller
// FREEDOM SPACE TO ADD ANYTHING RELATED TO ADMIN IN FUTURE

const adminSchema = new Schema(
    {   
        // UID: FK
        userId: {
        type: mongoose.Schema.Types.ObjectId,
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
              customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
              reviewTxt: { type: String },
              rating: { type: Number, required: true, min: 1, max: 5 }
            }
          ],


        // ADMIN PRODUCTS
        products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product', default: [] }] 
        

    },

    {
    timestamps: true,
    versionKey: false,
    }
);

  export default adminSchema