import { Schema, model} from "mongoose";

const orderSchema = new mongoose.Schema(
  { 
    // UID
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null, // allow null for guests
    },

    //
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true },
      },
    ],
    shippingAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ["Credit Card", "PayPal", "Cash on Delivery"],
    },
    paymentId: { type: String, required: true }, // Transaction ID
    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
    total: { type: Number, required: true, min: 0 },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

export const orderModel = model("Order", orderSchema);

