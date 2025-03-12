import express from "express";
import {
  updateSeller,
  getSeller,
  softDeleteSeller,
} from "../controllers/seller.controller.js";
import { tokenVerify } from "../middleware/tokenVerify.js";

const sellerRoutes = express.Router();

// [AMS] 🪪 using of verify token on all routes
sellerRoutes.use(tokenVerify);
sellerRoutes.get("seller", getSeller);
sellerRoutes.put("seller", updateSeller);
sellerRoutes.delete("seller", softDeleteSeller);

export default sellerRoutes;
