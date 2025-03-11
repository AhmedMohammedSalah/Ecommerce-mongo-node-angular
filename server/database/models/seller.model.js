import { Schema, model } from "mongoose";
const drawSchema = new Schema(
  {
    money: {
      type: Number,
      required: true,
    },
  },

  {
    timestamps: true,
    versionKey: false,
  }
);
const SellerSchema = new Schema(
  {
// -----------------------------------------------------|
// ||||||| [AMS] Payment  Addition     🤑 🤑    ||||| |||
// -----------------------------------------------------|
    _id: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    // balance of seller
    balance: {
      type: Number,
      default: 0,
    },
    // the draws is object {id,date,money}
    draws: {
      type: [drawSchema],
      default: [],
    },
// ---------------------------------------------------------
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
// Pre-save hook to set _id to userId
SellerSchema.pre("save", function (next) {
  if (this.isNew) {
    // Only set _id if the document is new
    this._id = this.userId;
  }
  next();
});

const sellerModel = model("Seller", SellerSchema);

export default sellerModel;
