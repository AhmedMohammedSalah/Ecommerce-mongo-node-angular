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
  console.log("hello in getting the seller by id function");

  try {
    const { sellerId } = req.params;

    let seller = await sellerModel.findById(sellerId).populate("userId");
    if (!seller) {
      seller = await sellerModel
        .findOne({ userId: sellerId })
        .populate("userId");
      if (!seller) return res.status(404).json({ message: "Seller not found" });
    }

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
      { isDeleted: true },
      { new: true }
    );

    if (!seller) return res.status(404).json({ message: "Seller not found" });

    res.status(200).json({ message: "Seller has been soft deleted", seller });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
/**
 * @author Ahmed M.Salah
 * @param {*} req
 * @param {*} res
 * @returns make seller draw from his mony
 */
export async function draw(req, res) {
  if (req.user.role !== "seller")
    res.status(400).send({ message: "you are not allowed to visit this page" });
  const sellerId = req.user._id;
  const seller = await sellerModel.findOne({ userId: sellerId });
  // console.log(seller)
  const { amount } = req.body;
  if (amount > seller.balance) {
    return res.status(400).send({
      message: "your balance is not enough  ",
      "your balace": seller.money,
    });
  }

  seller.balance -= amount;
  seller.draws.push({
    money: amount,
  });
  await seller.save();
  res.status(200).send({
    message: "you have drawed your money",
    amount,
    rest_balance: seller.balance,
    lastDraw: seller.draws[seller.draws.length - 1],
  });
}
export async function getMyDraws(req, res) {
  if (req.user.role !== "seller") {
    return res
      .status(400)
      .send({ message: "you are not allowed to visit this page" });
  }
  const sellerId = req.user._id;
  const seller = await sellerModel.findOne({ userId: sellerId });
  res.status(200).send({
    message: "success fetched your draws ",
    draws: seller.draws,
  });
}










export const restoreSeller = async (req, res) => {
  try {
    const { sellerId } = req.params;

    const seller = await sellerModel.findByIdAndUpdate(
      sellerId,
      { isDeleted: false}, 
      { new: true }
    );

    if (!seller) return res.status(404).json({ message: "Seller not found" });

    res.status(200).json({ message: "Seller has been restored", seller });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
