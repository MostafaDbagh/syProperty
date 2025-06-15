// services/reviewApi.js
import { Axios } from "axios";

// Create a new review
export const createReview = async (data) => {
  const response = await Axios.post('review', data);
  return response.data;
};

// Get all reviews
export const getAllReviews = async () => {
  const response = await Axios.get('review');
  return response.data;
};

// Get reviews by property ID
export const getReviewsByProperty = async (propertyId) => {
  const response = await Axios.get(`review/property/${propertyId}`);
  return response.data;
};

// Get reviews by agent ID
export const getReviewsByAgent = async (agentId) => {
  const response = await Axios.get(`review/agent/${agentId}`);
  return response.data;
};

// Like a review (pass review ID in body)
export const likeReview = async (data) => {
  const response = await Axios.post('review/like', data);
  return response.data;
};

// Dislike a review (pass review ID in body)
export const dislikeReview = async (data) => {
  const response = await Axios.post('review/dislike', data);
  return response.data;
};
