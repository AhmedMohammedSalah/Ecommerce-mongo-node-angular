import express from "express";
import { updateSeller, getSeller, softDeleteSeller } from "../controllers/sellerController.js";

const router = express.Router();

router.put("/:sellerId", updateSeller);     
router.get("/:sellerId", getSeller);     
router.delete("/:sellerId", softDeleteSeller);   

export default router;
