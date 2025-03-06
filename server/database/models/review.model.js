import { Schema, model } from "mongoose";

const reviewSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product ID is required"],
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot be more than 5"],
    },
    comment: {
      type: String,
      required: [true, "Comment is required"],
      trim: true,
      maxlength: [500, "Comment cannot be more than 500 characters"],
    },
    isApproved: {
      type: Boolean,
      default: false, // Reviews can be moderated before being displayed
    },
    helpfulCount: {
      type: Number,
      default: 0, // Track how many users found the review helpful
    },
    reported: {
      type: Boolean,
      default: false, // Flag to indicate if the review has been reported
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true }, // Include virtuals when converting to JSON
    toObject: { virtuals: true },
  }
);

// Virtual to populate user details without storing them in the database
reviewSchema.virtual("user", {
  ref: "User",
  localField: "userId",
  foreignField: "_id",
  justOne: true,
});

// Virtual to populate product details without storing them in the database
reviewSchema.virtual("product", {
  ref: "Product",
  localField: "productId",
  foreignField: "_id",
  justOne: true,
});

export const reviewModel = model("Review", reviewSchema);
