import { Schema, model } from "mongoose";

const SellerSchema = new Schema(
  {
    // UID FK CONSTRAINT
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // COMMERCIAL INFO
    businessName: { type: String, required: true },
    businessDetails: { type: Object, required: true },
    bankDetails: { type: Object, required: true },

    // SELLER STATUS
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    //--[SENU]-:-[LOGIC ERROR] (FIXED)
    // -------< rating should be array of rating for each customer >-------------
    
      //ratings: { type: Number, default: 0 }, //[OLD CODE]
      ratings: { 
        type: [Number], 
        validate: {
            validator: (arr) => {return arr.every(n => n >= 0 && n <= 5);},
            message: "each rating must be between 0 and 5"
        },
        default: []
      },

    //--------------------------------------------------------------------------

    //--[SENU]-:-[LOGIC ADDED]-----to store products related to seller------------------
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product', default: [] }],
    //--------------------END-----------------------------------------------------------

    softDelete: { type: Boolean, default: false },

  },

  {
    timestamps: true,
    versionKey: false,
  }
);

const sellerModel = model("Seller", SellerSchema);

export default sellerModel;
