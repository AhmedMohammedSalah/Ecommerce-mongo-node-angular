import express from "express";
import { updateSeller, getSeller, softDeleteSeller } from "../controllers/seller.Controller.js"; 

const sellerRoutes = express.Router();  

sellerRoutes.get("/profile", getSeller);  
sellerRoutes.put("/update", updateSeller);
sellerRoutes.delete("/:sellerId", softDeleteSeller);

export default sellerRoutes;
