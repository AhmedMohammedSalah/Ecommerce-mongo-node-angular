import { promoModel } from "../database/models/promotion.model.js";
import mongoose from "mongoose";


//[SENU]: EXPORTED isValidPromoId, findPromoById, findPromoByCode

/**
 * Helper function to validate promo ID
 * @param {string} id - Promo ID
 * @returns {boolean} - True if valid, false otherwise
 */
export const isValidPromoId = (id) => mongoose.Types.ObjectId.isValid(id);

/**
 * Helper function to find a promo by ID
 * @param {string} id - Promo ID
 * @returns {Promise<Object>} - Promo document
 */
export const findPromoById = async (id) => await promoModel.findById(id);

/**
 * @Author Ahmed Mohamed Salah
 * @param {*} req
 * @param {*} res
 * @returns Add new promo { message: "Promo added successfully", promo }
 */
export async function addPromo(req, res) {
  try {
    // Check if the user is admin (commented out for now)
    // if (req.user.role !== "admin")
    //   return res.status(401).json({ message: "Unauthorized" });

    // Validate request body
    const { code, discount, validFrom, validTo } = req.body;

    // Check if promo code already exists
    const existingPromo = await promoModel.findOne({ code });
    if (existingPromo) {
      return res.status(400).json({ message: "Promo code already exists" });
    }

    // Validate required fields
    if (!code || !discount || !validFrom || !validTo) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    // Validate discount range
    if (discount < 0 || discount > 100) {
      return res
        .status(400)
        .json({ message: "Discount must be between 0 and 100" });
    }

    // Validate date range
    if (validFrom > validTo) {
      return res
        .status(400)
        .json({ message: "Valid from date must be before valid to date" });
    }

    // Create and save the promo
    const promo = new promoModel(req.body);
    await promo.save();

    // Return success response
    res.status(201).json({ message: "Promo added successfully", promo });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding promo", error: error.message });
  }
}

/**
 * @Author Ahmed Mohamed Salah
 * @param {*} req
 * @param {*} res
 * @returns All promotions as JSON { message: "Successfully fetched all promos", promos }
 */
export async function getPromos(req, res) {
  try {
    // Check if the user is admin (commented out for now)
    // if (req.user.role !== "admin")
    //   return res.status(401).json({ message: "Unauthorized" });

    // Fetch all promos
    const promos = await promoModel.find();

    // Return success response
    res
      .status(200)
      .json({ message: "Successfully fetched all promos", promos });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching promos", error: error.message });
  }
}

/**
 * @Author Ahmed Mohamed Salah
 * @param {*} req
 * @param {*} res
 * @returns Updated promo as JSON { message: "Promo updated successfully", updatedPromo }
 */
export async function editPromo(req, res) {
  try {
    // Check if the user is admin (commented out for now)
    // if (req.user.role !== "admin")
    //   return res.status(401).json({ message: "Unauthorized" });

    // Validate promo ID
    const id = req.params.id;
    if (!isValidPromoId(id)) {
      return res.status(400).json({ message: "Invalid promo ID" });
    }

    // Find and update the promo
    const updatedPromo = await promoModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    // Check if promo exists
    if (!updatedPromo) {
      return res.status(404).json({ message: "Promo not found" });
    }

    // Return success response
    res
      .status(200)
      .json({ message: "Promo updated successfully", updatedPromo });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating promo", error: error.message });
  }
}

/**
 * @Author Ahmed Mohamed Salah
 * @param {*} req
 * @param {*} res
 * @returns Deactivated promo as JSON { message: "Promo deactivated successfully", deactivatedPromo }
 */
export async function deactivatePromo(req, res) {
  try {
    // Check if the user is admin (commented out for now)
    // if (req.user.role !== "admin")
    //   return res.status(401).json({ message: "Unauthorized" });

    // Validate promo ID
    const id = req.params.id;
    if (!isValidPromoId(id)) {
      return res.status(400).json({ message: "Invalid promo ID" });
    }

    // Find the promo
    const promo = await findPromoById(id);
    if (!promo) {
      return res.status(404).json({ message: "Promo not found" });
    }

    // Deactivate the promo
    const now = Date.now();
    const deactivatedPromo = await promoModel.findByIdAndUpdate(
      id,
      { validTo: now },
      { new: true }
    );

    // Return success response
    res
      .status(200)
      .json({ message: "Promo deactivated successfully", deactivatedPromo });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deactivating promo", error: error.message });
  }
}

/**
 * @Author Ahmed Mohamed Salah
 * @param {*} req
 * @param {*} res
 * @description Helper function to apply promo on user orders
 * @returns Promo by code if exists as JSON { message: "Promo found", promo }
 */
export async function findPromoByCode(req, res) {
  try {
    const { code } = req.body;

    // Find the promo by code
    const promo = await promoModel.findOne({ code });
    if (!promo) {
      return res.status(404).json({ message: "Promo not found" });
    }

    // Check if promo is active
    if (promo.validTo < Date.now()) {
      return res.status(400).json({ message: "Promo expired" });
    }

    // Return success response
    res.status(200).json({ message: "Promo found", promo });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error finding promo", error: error.message });
  }
}
