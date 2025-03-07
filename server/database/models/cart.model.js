import { Schema, model } from "mongoose";

const cartSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    sessionId: { type: String, default: null },
    items: { type: Array, default: [] },
    //AMS-> array of {productID ,price, discount, quantity }
    promoCode: { type: String, default: null },
  },
  { timestamps: true, versionKey: false }
);

const cartModel = model("Cart", cartSchema);
export default cartModel;
