import sellerModel from "../database/models/seller.model.js";

// AMS create  function createSellerProfile(usaerId){
  export const createSellerProfile = async (userId) => {
    try {
      // Check if the user already has a seller profile
      const existingSeller = await sellerModel.findOne({ userId });
      if (existingSeller) {
        return { error: "Seller profile already exists" };
      }
  
      // Create new seller profile
      const newSeller = new sellerModel({ userId });
      const savedSeller = await newSeller.save();
  
      return savedSeller;
    } catch (error) {
      return { error: error.message };
    }
  };
  
// }

/**
 * @Author rehab
 * @param {*} req
 * @param {*} res
 * @returns Add new promo res.status(200).json(updatedSeller);
 */
export const updateSeller = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const { updateData } = req.body;
    const currentUser = req.user; 

    // Check if the user is an admin or updating their own profile
    if (!currentUser.isAdmin && currentUser.id !== sellerId) {
      return res.status(403).json({ message: "Unauthorized action" });
    }

    const updatedSeller = await sellerModel.findByIdAndUpdate(
      sellerId,
      updateData,
      {
        new: true,
      }
    );

    if (!updatedSeller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    res.status(200).json(updatedSeller);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @description function to get seller profile
 * @route
 *  @edited by rehab
 *  @edited on 2023-02-22
 *
 */

export const getSeller = async (req, res) => {
  try {
    const { sellerId } = req.params;

    const seller = await sellerModel.findById(sellerId);
    if (!seller) return res.status(404).json({ message: "Seller not found" });

    res.status(200).json(seller);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @description function to get delete seller profile
 * @route
 *  @edited by rehab
 *  @edited on 2023-02-22
 *
 */

export const softDeleteSeller = async (req, res) => {
  try {
    const { sellerId } = req.params;

    const seller = await sellerModel.findByIdAndUpdate(
      sellerId,
      { softDelete: true },
      { new: true }
    );

    if (!seller) return res.status(404).json({ message: "Seller not found" });

    res.status(200).json({ message: "Seller has been soft deleted", seller });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
