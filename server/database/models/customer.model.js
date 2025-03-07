import {Schema, model} from "mongoose";

// [SENU] CREATED 
// [AMS] Great jop ✅
const customerSchema = new mongoose.Schema(
  {
    // ID 
    _id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // PAYMENT
    paymentMethods: {
      type: [String],
      default: []
    },

    // WISH LIST [BONUS]
    wishlist: {
      type: [Schema.Types.ObjectId],
      ref: "Product",
      default: []
    },

    // LOYALITY POINT [REDUCE PRICE][BONUS]
    loyaltyPoints: {
      type: Number,
      default: 0
    },

    // DIFFERENT LANG [BONUS]
    preferredLanguage: {
      type: String,
      default: "en"
    },

    // NOTIFICATION [TIME BOUNDED]
    notifications: {
      type: Object,
      default: {}
    }
  },
  { timestamps: true }
);

const customerModel = mongoose.model("Customer", customerSchema);

export default customerModel;
