import express from "express";
import {
  updateSeller,
  getSeller,
  softDeleteSeller,
  draw,
  getMyDraws,
} from "../controllers/seller.controller.js";
import { tokenVerify } from "../middleware/tokenVerify.js";

const sellerRoutes = express.Router();

// sellerRoutes.get("/seller/:sellerId", getSeller);
// [AMS] 🪪 using of verify token on all routes
sellerRoutes.use(tokenVerify);
sellerRoutes.get("/seller/mydraws", getMyDraws);
sellerRoutes.put("/seller", updateSeller);
sellerRoutes.delete("/seller", softDeleteSeller);
sellerRoutes.post("/seller/draw",draw)
export default sellerRoutes;
