import { Schema, model } from "mongoose";

const orderSchema = new Schema(
  {
    // UID
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null, // allow null for guests
    },

    // ITEMS
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: "Product" },
        discount: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true },
      },
    ],

    // ADDRESS DELIVER
    shippingAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, required: true },
    },

    // PAYMENT
    paymentMethod: {
      type: String,
      required: true,
      enum: ["Credit Card", "PayPal", "Cash on Delivery"],
    },
    paymentId: { type: String, required: true }, // Transaction ID
    status: {
      type: String,
      enum: [
        "Prepaid",
        "Pending",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
      ],
      default: "Prepaid",
    },

    // TOTAL PRICE + DISCOUNT APPLIED + PROMO APPLIED
    total: { type: Number, required: true, min: 0 },

    //--state list when shipping logic accumlate----
    stateList: { type: Array, default: [] },
    //----------------------------------------------
  },
  { timestamps: true, versionKey: false }
);

const orderModel = model("Order", orderSchema);

export default orderModel;
