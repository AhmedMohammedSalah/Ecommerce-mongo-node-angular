import { Router } from "express";
import { createReview, readReview } from "../controllers/review.controller.js";

export const reviewRouter = Router();
reviewRouter.post("review", createReview);
reviewRouter.get("review/:id", readReview);


