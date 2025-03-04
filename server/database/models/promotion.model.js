import { Schema, model } from "mongoose";

const promoCodeSchema = new Schema(
  {
    code: {
      type: String,
      required: [true, "Promo code is required."],
      unique: true,
      minlength: [3, "Promo code must be at least 3 characters long."],
      maxlength: [20, "Promo code cannot exceed 20 characters."],
    },
    discount: {
      type: Number,
      required: [true, "Discount is required."],
      min: [1, "Discount must be at least 1%."],
      max: [99, "Discount cannot exceed 99%."],
    },
    validFrom: {
      type: Date,
      required: true,
      default: Date.now,
      validate: {
        validator: function (value) {
          return value >= new Date();
        },
        message: "validFrom must be a future date.",
      },
    },
    validTo: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return value > this.validFrom;
        },
        message: "validTo must be greater than validFrom.",
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
// Pre-save hook for date validation
promoCodeSchema.pre('save', function (next) {
  if (this.validTo <= this.validFrom) {
    return next(new Error('validTo must be greater than validFrom.'));
  }
  next();
});

export const promoModel = model("Promo", promoCodeSchema);
