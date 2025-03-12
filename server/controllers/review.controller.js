import { reviewModel } from "../database/models/review.model.js";

/**
 * @author Ahmed M.Salah
 * @param {*} productId
 * @returns all reviews related to product
 */
export async function getReviewsByProductId(productId) {
  try {
    const reviews = await reviewModel.find({ productId });
    return reviews;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw error;
  }
}
/**
 * @author Ahmed M.Salah
 * @param {*} productId
 * @returns the average rating of product to help in update product
 */
export async function calcRating(productId) {
  try {
    const reviews = await getReviewsByProductId(productId);
    if (reviews.length === 0) {
      return 0;
    }
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    const count = reviews.length;
    return sum / count;
  } catch (error) {
    console.error("Error calculating rating:", error);
    throw error;
  }
}
/**
 * @author Ahmed M.Salah
 * @param {*} req
 * @param {*} res
 * @return res.status( 201 ).json( { message: "Review created successfully", review } );
 */
export async function createReview(req, res) {
  const { productId, rating, comment } = req.body;
  // Validate rating
  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: "Rating must be between 1 and 5" });
  }
  // Validate comment
  if (!comment || comment.trim().length === 0) {
    return res.status(400).json({ message: "Comment cannot be empty" });
  }
  const userId = req.user._id;
  try {
    const review = new reviewModel({ productId, userId, rating, comment });
    await review.save();
    const populatedReview = await reviewModel
      .findById(review._id)
      .populate("userId", "name email")
      .populate("productId", "productName price");

    res.status(201).json({
      message: "Review created successfully",
      review: populatedReview,
    });
  } catch (error) {
    res.status(400).json({ message: "Failed to create review", error });
  }
}

/**
 * @author Ahmed M.Salah
 * @param {*} req
 * @param {*} res
 * @return res.status( 200 ).json( review );
 */
export async function readReview(req, res) {
  const reviewId = req.params.id;
  try {
    const review = await reviewModel
      .findById(reviewId)
      .populate("userId", "name email")
      .populate("productId", "ProductName price");

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.status(200).json(review);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Failed to read review", error: error.message });
  }
}
