import Joi from "joi";

const signupSchema = Joi.object({
  name: Joi.string().min(3).max(30).required().messages({
    "string.empty": "Name cannot be empty",
    "string.min": "Name must be at least 3 characters long",
  }),

  email: Joi.string().email().required().messages({
    "string.email": "Invalid email format",
  }),

  password: Joi.string()
    .min(6)
    .max(20)
    .required()
    .pattern(new RegExp("^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{6,}$"))
    .messages({
      "string.pattern.base":
        "Password must contain at least one letter and one number",
    }),

  role: Joi.string().valid("user", "seller", "admin").default("user"),

  isConfirmed: Joi.boolean().default(false),
});
const signinSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email format",
  }),

  password: Joi.string()
    .min(6)
    .max(20)
    .required()
    .pattern(new RegExp("^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{6,}$"))
    .messages({
      "string.pattern.base":
        "Password must contain at least one letter and one number",
    }),

  role: Joi.string().valid("user", "seller", "admin").default("user"),

  isConfirmed: Joi.boolean().default(false),
});
export { signupSchema, signinSchema };
