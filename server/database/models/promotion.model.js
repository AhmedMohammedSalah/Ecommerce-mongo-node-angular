import { Schema, model } from "mongoose";

const promoCodeSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      minlength: 3,

      maxlength: 20,
    },
    discount: {
      type: Number,
      required: true,
      min: 1,
      max: 99,
    },
    validFrom: {
      type: Date,
      required: true,
      min: Date.now,
      max: new Date("2030-05-23T23:59:59"),
    },
    validTo: {
      type: Date,
      required: true,
      min: Date.now,
      max: new Date("2030-05-23T23:59:59"),
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const promoModel = model("Promo", promoCodeSchema);
