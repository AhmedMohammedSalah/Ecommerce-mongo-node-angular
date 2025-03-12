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

// [AMS] 🪪 using of verify token on all routes
categoryRouter.use(tokenVerify);
categoryRouter.post("/categories", createCategory);
categoryRouter.get("/categories", getAllCategories);
categoryRouter.get("/categories/:id", getCategoryById);
categoryRouter.put("/categories/:id", updateCategory);
categoryRouter.delete("/categories/:id", deleteCategory);

export default categoryRouter;