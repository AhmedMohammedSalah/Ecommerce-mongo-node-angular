import { Router } from "express";
const router = Router();
import { auth, isAdmin } from "../middleware/authMiddleware.js";
import {
  getUser,
  updateUser,
  deleteUser,
} from "../Controllers/userController.js";

router.get("/:id", auth, isAdmin, getUser);
router.patch("/:id", auth, updateUser);
router.delete("/:id", auth, isAdmin, deleteUser);

export default router;
