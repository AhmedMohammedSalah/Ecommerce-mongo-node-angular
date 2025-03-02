

import express from "express";
import Seller from "../models/Seller.js";

const router = express.Router();
/**
 * @description show all sellers 
 *  @route POST /sellers
 *  @    rehab kamal
 *  
 */
router.get("/", async (req, res) => {
  try {
    const sellers = await Seller.find({ softDelete: false });
    res.status(200).json(sellers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @description create a new seller
 *   @postman_link  http://localhost:3000/sellers/create
 *  
 */


router.post("/create", async (req, res) => {
  try {
    const { userId, businessName, businessDetails, bankDetails } = req.body;

    const newSeller = new Seller({
      userId,
      businessName,
      businessDetails,
      bankDetails
    });

    const savedSeller = await newSeller.save();
    res.status(201).json(savedSeller);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 *  @description update seller by id 
 *  @postman_link http://localhost:3000/sellers/update/seller_id
 *  
 */
router.put("/update/:id", async (req, res) => {
    try {
      const updatedSeller = await Seller.findByIdAndUpdate(
        req.params.id, 
        req.body, 
        { new: true } 
      );
  
      if (!updatedSeller) return res.status(404).json({ message: "Seller not found" });
  
      res.status(200).json({ message: "Seller updated successfully", seller: updatedSeller });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });


  /**
   *  @description get seller by id
   *  @postman_link http://localhost:3000/sellers/seller_id
   */

router.get("/:id", async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.id);
    if (!seller || seller.softDelete) {
      return res.status(404).json({ message: "Seller not found" });
    }
    res.status(200).json(seller);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


/**
 *  @description soft delete seller by id
 *  @postman_link http://localhost:3000/sellers/delete/seller_id
 */
router.delete("/delete/:id", async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.id);
    if (!seller) return res.status(404).json({ message: "Seller not found" });

    seller.softDelete = true;
    await seller.save();

    res.status(200).json({ message: "Seller soft-deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
