import { Schema, model } from 'mongoose'

const paymentSchema = new Schema(
  {
    paymentMethod: {
      type: String,
    // required: true,
        default:"PAYPAL"
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "success", "failed", "canceled"],
      default: "pending",
    },
    amount: {
      type: Number,
      required: true,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
        },
    // for paypal or stripe gatway
    paymentGatewayId: {
        type: String,
        required: true
        
    }
  },
  { timestamps: true, versionKey: false }
);

export const paymentModel = model( 'Payment', paymentSchema );