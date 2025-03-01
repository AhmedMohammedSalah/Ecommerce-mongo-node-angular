import { Schema, model } from "mongoose";

const catSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      minlength: 3,

      maxlength: 20,
    },
    description: {
      type: String,
      required: false,
      minlength: 3,
      maxlength: 20,
    },
    parentId: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: false
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const catModel = model("Category", catSchema);
