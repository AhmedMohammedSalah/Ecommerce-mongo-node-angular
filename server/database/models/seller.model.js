import { Schema, model } from "mongoose";

const SellerSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    //--[SENU]: WARNING: <email duplicated> ---> exist in user schema [parent]-----
    email: { type: String, unique: true, sparse: true },
    //----------------------------------------------------------------------------
    businessName: { type: String, required: true },
    businessDetails: { type: Object, required: true },
    bankDetails: { type: Object, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    //--[SENU]-:-[LOGIC ERROR]---rating should be array of rating for each customer-------
    ratings: { type: Number, default: 0 },
    //-----------------------------------------------------------------------------------

    //--[SENU]-:-WARNING:---
    createdAt: { type: Date, default: Date.now },
    softDelete: { type: Boolean, default: false },

    //--[SENU]-:-[LOGIC ADD]-----to store products related to seller------------------------------
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product', default: [] }] 
    //--------------------END---------------------------------------------------------

  },

  {
    timestamps: true,
    versionKey: false,
  }
);

const sellerModel = model("Seller", SellerSchema);

export default sellerModel;
