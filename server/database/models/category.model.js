import { Schema, model } from "mongoose";

const catSchema = new Schema(
  {
    name: {
      type: String,

      required: [true, "Category name is required."],
      unique: true,
      minlength: [3, "Category name must be at least 3 characters long."],
      maxlength: [20, "Category name cannot exceed 20 characters."],
    },
    description: {
      type: String,
      required: false,
      minlength: 3,
      maxlength: 200,
      default: "No description provided.",
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: false,
      validate: {
        validator: async function (value) {
          if (!value) return true;
          const category = await model("Category").findById(value);
          return !!category;
        },
        message: "Parent category does not exist.",
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
// Virtual for child categories
catSchema.virtual("children", {
  ref: "Category",
  localField: "_id",
  foreignField: "parentId",
});
// Pre-save hook to prevent circular references
catSchema.pre("save", async function (next) {
  if (this.parentId) {
    let currentParentId = this.parentId;
    while (currentParentId) {
      if (currentParentId.equals(this._id)) {
        return next(new Error("Circular reference detected."));
      }
      const parentCategory = await 
        model("Category")
        .findById(currentParentId);
      currentParentId = parentCategory ? parentCategory.parentId : null;
    }
  }
  next();
});

export const catModel = model("Category", catSchema);
