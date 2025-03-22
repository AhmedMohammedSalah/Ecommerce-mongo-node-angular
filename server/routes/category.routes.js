import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller.js";
import { Router } from "express";
import { tokenVerify } from "../middleware/tokenVerify.js";

const categoryRouter = Router();

categoryRouter.get("/categories", getAllCategories);
categoryRouter.get("/categories/:id", getCategoryById);

// [AMS] 🪪 using of verify token on all routes
categoryRouter.post("/categories",tokenVerify, createCategory);
categoryRouter.put("/categories/:id",tokenVerify, updateCategory);
categoryRouter.delete("/categories/:id",tokenVerify, deleteCategory);

export default categoryRouter;
