import { Router } from "express";
import { createReview, readReview } from "../controllers/review.controller.js";
import { tokenVerify } from "../middleware/tokenVerify.js";

export const reviewRouter = Router();
// [AMS] 🪪 using of verify token on all routes
reviewRouter.use(tokenVerify);
reviewRouter.post("/review", createReview);
reviewRouter.get("/review/:id", readReview);
