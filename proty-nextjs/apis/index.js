// Comprehensive API exports for the frontend
import authAPI from './auth';
import userAPI from './user';
import listingAPI from './listing';
import reviewAPI from './review';
import contactAPI from './contact';
import favoriteAPI from './favorites';
import agentAPI from './agent';
import pointAPI from './points';
import { messageAPI } from './message';
import { newsletterAPI } from './newsletter';

// Export all APIs
export {
  authAPI,
  userAPI,
  listingAPI,
  reviewAPI,
  contactAPI,
  favoriteAPI,
  agentAPI,
  pointAPI,
  messageAPI,
  newsletterAPI
};

// Default export with all APIs
export default {
  auth: authAPI,
  user: userAPI,
  listing: listingAPI,
  review: reviewAPI,
  contact: contactAPI,
  favorites: favoriteAPI,
  agent: agentAPI,
  points: pointAPI,
  message: messageAPI,
  newsletter: newsletterAPI
};

// Individual exports for convenience
export const auth = authAPI;
export const user = userAPI;
export const listing = listingAPI;
export const review = reviewAPI;
export const contact = contactAPI;
export const favorites = favoriteAPI;
export const agent = agentAPI;
export const points = pointAPI;
export const message = messageAPI;
export const newsletter = newsletterAPI;
