import express from "express";
import { restoreSeller } from "../controllers/seller.controller.js";
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
sellerRoutes.get("/seller/:sellerId", getSeller); //[SENU]: GET SELLER ENDPOINT
sellerRoutes.get("/seller/mydraws", getMyDraws);
sellerRoutes.put("/seller", updateSeller);
sellerRoutes.put("/seller/:sellerId", updateSeller);

sellerRoutes.delete("/seller", softDeleteSeller);
sellerRoutes.delete("/seller/:sellerId", softDeleteSeller);

sellerRoutes.put("/restore-seller/:sellerId", restoreSeller);

sellerRoutes.post("/seller/draw",draw)
export default sellerRoutes;
