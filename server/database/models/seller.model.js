import { Schema, model } from "mongoose";

const SellerSchema = new Schema(
  {
    // UID FK CONSTRAINT
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    //--[SENU]: WARNING: <email duplicated> ---> exist in user schema [parent]-----
    //[AMS] deleted❗  email: { type: String, unique: true, sparse: true },
    //----------------------------------------------------------------------------

    // COMMERCIAL INFO
    //[AMS] ❎ remove any required from the following
    // because when it created auto
    businessName: { type: String /*,required: true*/ },
    businessDetails: { type: Object /*,required: true*/ },
    bankDetails: { type: Object /*,required: true*/ },

    // SELLER STATUS
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    //--[SENU]-:-[LOGIC ERROR] (FIXED)
    // -------< added more general attribute, rating will be computed from it >-------------

    // ratings: { type: Number, default: 0 }, //[OLD CODE]

    // REVIEWS: reviews(txt) of customer to the admin as a seller
    reviews: [
      {
        customerId: {
          type: Schema.Types.ObjectId,
          ref: "User",
          /*,required: true*/
        },
        reviewTxt: { type: String },
        rating: { type: Number, required: true, min: 1, max: 5 },
      },
    ],

    //--------------------------------------------------------------------------

    //--[SENU]-:-[LOGIC ADDED]-----to store products related to seller------------------
    products: [{ type: Schema.Types.ObjectId, ref: "Product", default: [] }],
    //--------------------END-----------------------------------------------------------

    softDelete: { type: Boolean, default: false },

    //--[SENU]-:-[LOGIC ADDED]----store the orders of customer to seller product-----
    orders: { type: Array, default: [] },
    //-------------------------------------------------------------------------------

  },

  {
    timestamps: true,
    versionKey: false,
  }
);

const sellerModel = model("Seller", SellerSchema);

export default sellerModel;
