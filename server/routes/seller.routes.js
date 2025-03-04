import express from "express";
import {
  updateSeller,
  getSeller,
  softDeleteSeller,
} from "../controllers/seller.controller.js";

const sellerRoutes = express.Router();

sellerRoutes.get("seller", getSeller);
sellerRoutes.put("seller", updateSeller);
sellerRoutes.delete("seller", softDeleteSeller);

export default sellerRoutes;
