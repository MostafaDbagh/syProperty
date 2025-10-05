// Comprehensive API exports for the frontend
import authAPI from './auth';
import listingAPI from './listing';
import reviewAPI from './review';
import contactAPI from './contact';
import favoriteAPI from './favorites';
import agentAPI from './agent';
import pointAPI from './points';

// Export all APIs
export {
  authAPI,
  listingAPI,
  reviewAPI,
  contactAPI,
  favoriteAPI,
  agentAPI,
  pointAPI
};

// Default export with all APIs
export default {
  auth: authAPI,
  listing: listingAPI,
  review: reviewAPI,
  contact: contactAPI,
  favorites: favoriteAPI,
  agent: agentAPI,
  points: pointAPI
};

// Individual exports for convenience
export const auth = authAPI;
export const listing = listingAPI;
export const review = reviewAPI;
export const contact = contactAPI;
export const favorites = favoriteAPI;
export const agent = agentAPI;
export const points = pointAPI;
