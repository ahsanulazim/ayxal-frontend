import api from "@/axios/axiosInstance";

/**
 * 1. Submit or update review
 */
export const createReview = async (reviewData) => {
  const res = await api.post("/reviews/create", reviewData);
  return res.data;
};

/**
 * 2. Get customer's submitted reviews
 */
export const getMyReviews = async (email) => {
  const res = await api.get(`/reviews/my-reviews?email=${email}`);
  return res.data;
};

/**
 * 3. Get reviews for a specific product
 */
export const getProductReviews = async (productId) => {
  const res = await api.get(`/reviews/product/${productId}`);
  return res.data;
};

/**
 * 4. Delete a customer review
 */
export const deleteReview = async (id, email) => {
  const res = await api.delete(`/reviews/delete?id=${id}&email=${email}`);
  return res.data;
};
