import Seller from "../models/Seller.js";



/**
* @description function to update seller profile
* @route 
*  @edited by rehab
*  @edited on 2023-02-22
*  
*/
export const updateSeller = async (req, res) => {
    try {
        const { sellerId } = req.params;
        const updateData = req.body;

        const updatedSeller = await Seller.findByIdAndUpdate(sellerId, updateData, { new: true });

        if (!updatedSeller) return res.status(404).json({ message: "Seller not found" });

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

        const seller = await Seller.findById(sellerId);
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

        const seller = await Seller.findByIdAndUpdate(sellerId, { softDelete: true }, { new: true });

        if (!seller) return res.status(404).json({ message: "Seller not found" });

        res.status(200).json({ message: "Seller has been soft deleted", seller });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
