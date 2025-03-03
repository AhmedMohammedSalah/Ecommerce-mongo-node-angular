import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  sessionId: { type: String, default: null },
  items: { type: Array, default: [] },
  promoCode: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
},
  { timestamps: true,
    versionKey:false

   }
);

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
