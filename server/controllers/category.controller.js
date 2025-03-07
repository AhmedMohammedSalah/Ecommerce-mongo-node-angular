import { catModel } from "../database/models/category.model.js";
import mongoose from "mongoose";

/**
 * @author : Ahmed M.Salah
 * @param {string} categoryName
 * @description helper function for filters by category
 * @returns category id
 */
export async function getCategoryId(categoryName) {
  try {
    const category = await catModel.findOne({ name: categoryName });
    if (category) {
      return category._id;
    } else {
      throw new Error("Category not found");
    }
  } catch (error) {
    console.error(error);
  }
}
/**
 * @Author AhmedMohammedSalah
 * @param {*} req
 * @param {*} res
 * @logic Create a new category
 * @returns Created category as JSON { message: "Category created successfully", category }
 */
export async function createCategory(req, res) {
  // Check Authority (Admin only)
  // if (req.user.role !== 'admin')
  //   return res.status(401).json({ message: 'Unauthorized' });

  // Extract data from request body
  const { name, description, parentId } = req.body;

  // Validate required fields
  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }

  try {
    // Create a new category
    const category = await catModel.create({
      name,
      description,
      parentId,
    });

    // Return success response
    return res
      .status(201)
      .json({ message: "Category created successfully", category });
  } catch (error) {
    // Handle errors
    /// error code of duplication is 11000
    if (error.code === 11000) {
      return res.status(400).json({ message: "Category name must be unique" });
    }
    return res
      .status(400)
      .json({ message: "Failed to create category", error });
  }
}

/**
 * @Author AhmedMohammedSalah
 * @param {*} req
 * @param {*} res
 * @logic Get all categories
 * @returns List of categories as JSON { message: "Categories fetched successfully", categories }
 */
export async function getAllCategories(req, res) {
  try {
    // Fetch all categories
    const categories = await catModel.find().populate("children");
    // Return success response
    return res
      .status(200)
      .json({ message: "Categories fetched successfully", categories });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Failed to fetch categories", error });
  }
}

/**
 * @Author AhmedMohammedSalah
 * @param {*} req
 * @param {*} res
 * @logic Get a single category by ID
 * @returns Category details as JSON { message: "Category fetched successfully", category }
 */
export async function getCategoryById(req, res) {
  // Get category ID from request params
  const id = req.params.id;

  // Check if ID is valid
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid category ID" });
  }

  try {
    // Find category by ID
    const category = await catModel.findById(id).populate("children");

    // Check if category exists
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Return success response
    return res
      .status(200)
      .json({ message: "Category fetched successfully", category });
  } catch (error) {
    // Handle errors
    return res.status(500).json({ message: "Failed to fetch category", error });
  }
}

/**
 * @Author AhmedMohammedSalah
 * @param {*} req
 * @param {*} res
 * @logic Update a category by ID
 * @returns Updated category as JSON { message: "Category updated successfully", updatedCategory }
 */
export async function updateCategory(req, res) {
  // Check Authority (Admin only)
  // if (req.user.role !== 'admin')
  //   return res.status(401).json({ message: 'Unauthorized' });

  // Get category ID from request params
  const id = req.params.id;

  // Check if ID is valid
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid category ID" });
  }

  // Extract data from request body
  const { name, description, parentId } = req.body;

  try {
    // Find and update the category
    const updatedCategory = await catModel.findByIdAndUpdate(
      id,
      { name, description, parentId },
      { new: true, runValidators: true }
    );

    // Check if category exists
    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Return success response
    return res
      .status(200)
      .json({ message: "Category updated successfully", updatedCategory });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Category name must be unique" });
    }
    return res
      .status(500)
      .json({ message: "Failed to update category", error });
  }
}

/**
 * @Author AhmedMohammedSalah
 * @param {*} req
 * @param {*} res
 * @logic Delete a category by ID
 * @returns Success message as JSON { message: "Category deleted successfully" }
 */
export async function deleteCategory(req, res) {
  // Check Authority (Admin only)
  // if (req.user.role !== 'admin')
  //   return res.status(401).json({ message: 'Unauthorized' });

  // Get category ID from request params
  const id = req.params.id;

  // Check if ID is valid
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid category ID" });
  }

  try {
    // Find and delete the category
    const deletedCategory = await catModel.findByIdAndDelete(id);

    // Check if category exists
    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Return success response
    return res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    // Handle errors
    return res
      .status(500)
      .json({ message: "Failed to delete category", error });
  }
}
