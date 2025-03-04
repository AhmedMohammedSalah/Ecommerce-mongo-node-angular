import { Schema, model } from "mongoose";

const SellerSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    businessName: { type: String, required: true },
    businessDetails: { type: Object, required: true },
    bankDetails: { type: Object, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    ratings: { type: Number, default: 0 },
    softDelete: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false }
);

const sellerModel = model("Seller", SellerSchema);

export default sellerModel;
