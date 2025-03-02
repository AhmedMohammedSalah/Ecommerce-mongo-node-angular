import sellerModel from "../database/models/sellerModel.model.js";

export const updateSeller = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const updateData = req.body;

    const updatedSeller = await sellerModel.findByIdAndUpdate(sellerId, updateData, {
      new: true,
    });

    if (!updatedSeller)
      return res.status(404).json({ message: "Seller not found" });

    res.status(200).json(updatedSeller);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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
