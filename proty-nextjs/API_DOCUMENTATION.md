# Frontend API Implementation Documentation

This document provides comprehensive documentation for all frontend API implementations in the Proty project.

## Overview

The frontend API implementation provides a complete interface to all backend services including:
- Authentication (signup, signin, signout, Google auth)
- Listings (CRUD operations, search, image handling)
- Reviews (create, get, like/dislike)
- Contacts (CRUD operations)
- Favorites (add, remove, get)
- Agents (CRUD operations with image upload)
- Points (balance, charge, transactions)

## File Structure

```
apis/
├── index.js          # Main API exports
├── hooks.js          # React Query hooks
├── auth.js           # Authentication API
├── listing.js        # Listing API
├── review.js         # Review API
├── contact.js        # Contact API
├── favorites.js      # Favorite API
├── agent.js          # Agent API
└── points.js         # Point API
```

## Configuration

### Axios Configuration (`axios/index.js`)

- **Base URL**: `http://localhost:5500/api`
- **Timeout**: 10 seconds
- **Automatic token handling**: Request/response interceptors
- **Error handling**: Automatic logout on 401 errors

## API Modules

### 1. Authentication API (`auth.js`)

```javascript
import { authAPI } from '@/apis';

// Signup
const user = await authAPI.signup({
  username: 'john_doe',
  email: 'john@example.com',
  password: 'password123'
});

// Signin
const result = await authAPI.signin({
  email: 'john@example.com',
  password: 'password123'
});

// Google authentication
const googleResult = await authAPI.google({
  googleId: 'google_id',
  email: 'john@gmail.com',
  name: 'John Doe'
});

// Signout
await authAPI.signout();

// Check authentication status
const isAuth = authAPI.isAuthenticated();

// Get current token
const token = authAPI.getToken();
```

### 2. Listing API (`listing.js`)

```javascript
import { listingAPI } from '@/apis';

// Get all listings
const listings = await listingAPI.getListings();

// Search listings
const searchResults = await listingAPI.searchListings({
  location: 'New York',
  minPrice: 100000,
  maxPrice: 500000,
  propertyType: 'house'
});

// Create listing with images
const formData = {
  title: 'Beautiful House',
  description: 'Amazing property',
  price: 300000,
  location: 'New York',
  images: [file1, file2, file3], // File objects
  imageNames: ['image1.jpg', 'image2.jpg', 'image3.jpg']
};
const newListing = await listingAPI.createListing(formData);

// Get listing by ID
const listing = await listingAPI.getListingById('listing_id');

// Get listing images
const images = await listingAPI.getListingImages('listing_id');

// Update listing
const updatedListing = await listingAPI.updateListing('listing_id', {
  title: 'Updated Title',
  price: 350000
});

// Delete listing
await listingAPI.deleteListing('listing_id');

// Get listings by agent
const agentListings = await listingAPI.getListingsByAgent('agent_id');

// Get state count statistics
const stateCount = await listingAPI.getStateCount();
```

### 3. Review API (`review.js`)

```javascript
import { reviewAPI } from '@/apis';

// Create review
const review = await reviewAPI.createReview({
  propertyId: 'property_id',
  agentId: 'agent_id',
  rating: 5,
  comment: 'Great property!',
  userId: 'user_id'
});

// Get all reviews
const reviews = await reviewAPI.getReviews();

// Get reviews by property
const propertyReviews = await reviewAPI.getReviewsByProperty('property_id');

// Get reviews by agent
const agentReviews = await reviewAPI.getReviewsByAgent('agent_id');

// Like review
await reviewAPI.likeReview('review_id');

// Dislike review
await reviewAPI.dislikeReview('review_id');
```

### 4. Contact API (`contact.js`)

```javascript
import { contactAPI } from '@/apis';

// Create contact
const contact = await contactAPI.createContact({
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+1234567890',
  message: 'Interested in property',
  interest: 'buying',
  propertyId: 'property_id'
});

// Get all contacts
const contacts = await contactAPI.getContacts();

// Get contact by ID
const contact = await contactAPI.getContact('contact_id');

// Delete contact
await contactAPI.deleteContact('contact_id');
```

### 5. Favorite API (`favorites.js`)

```javascript
import { favoriteAPI } from '@/apis';

// Add to favorites
await favoriteAPI.addFavorite('property_id');

// Remove from favorites
await favoriteAPI.removeFavorite('property_id');

// Get user's favorites
const favorites = await favoriteAPI.getFavorites();

// Check if favorited
const isFavorited = await favoriteAPI.isFavorited('property_id');

// Toggle favorite status
const result = await favoriteAPI.toggleFavorite('property_id');
```

### 6. Agent API (`agent.js`)

```javascript
import { agentAPI } from '@/apis';

// Create agent with images
const agentData = {
  fullName: 'John Smith',
  email: 'john@agent.com',
  phone: '+1234567890',
  companyName: 'ABC Realty',
  position: 'Senior Agent',
  description: 'Experienced real estate agent',
  avatar: avatarFile, // File object
  poster: posterFile  // File object
};
const agent = await agentAPI.createAgent(agentData);

// Get all agents
const agents = await agentAPI.getAgents();

// Get agent by ID
const agent = await agentAPI.getAgentById('agent_id');

// Update agent
const updatedAgent = await agentAPI.updateAgent('agent_id', {
  fullName: 'John Smith Updated',
  description: 'Updated description'
});

// Delete agent
await agentAPI.deleteAgent('agent_id');
```

### 7. Point API (`points.js`)

```javascript
import { pointAPI } from '@/apis';

// Get point balance
const balance = await pointAPI.getPointBalance();

// Charge points
const result = await pointAPI.chargePoints({
  amount: 1000,
  paymentMethod: 'credit_card',
  paymentReference: 'payment_ref_123'
});

// Deduct points
await pointAPI.deductPoints({
  amount: 50,
  description: 'Property listing publication',
  listingId: 'listing_id'
});

// Get transaction history
const transactions = await pointAPI.getTransactionHistory({
  page: 1,
  limit: 10
});

// Calculate listing cost
const cost = await pointAPI.calculateListingCost({
  propertyType: 'house',
  location: 'New York',
  price: 300000
});

// Refund points
await pointAPI.refundPoints({
  amount: 50,
  description: 'Listing deletion refund',
  listingId: 'listing_id'
});
```

## React Query Hooks

### Usage Example

```javascript
import { useListings, useCreateListing, useAuth } from '@/apis/hooks';

function PropertyList() {
  const { data: listings, isLoading, error } = useListings();
  const createListingMutation = useCreateListing();
  const { signin, isSigningIn } = useAuth();

  const handleCreateListing = async (listingData) => {
    try {
      await createListingMutation.mutateAsync(listingData);
      // Success handling
    } catch (error) {
      // Error handling
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {listings?.map(listing => (
        <div key={listing._id}>{listing.title}</div>
      ))}
    </div>
  );
}
```

### Available Hooks

- **Authentication**: `useAuth()`
- **Listings**: `useListings()`, `useListing()`, `useCreateListing()`, `useUpdateListing()`, `useDeleteListing()`
- **Reviews**: `useReviews()`, `useReviewsByProperty()`, `useCreateReview()`
- **Contacts**: `useContacts()`, `useCreateContact()`
- **Favorites**: `useFavorites()`, `useAddFavorite()`, `useRemoveFavorite()`
- **Agents**: `useAgents()`, `useAgent()`, `useCreateAgent()`
- **Points**: `usePointBalance()`, `useTransactionHistory()`, `useChargePoints()`, `useCalculateListingCost()`

## Error Handling

All API functions include comprehensive error handling:

```javascript
try {
  const result = await listingAPI.createListing(data);
  // Handle success
} catch (error) {
  // Error object contains:
  // - error.message: Error message
  // - error.response?.data: Backend error response
  console.error('API Error:', error);
}
```

## Authentication Flow

1. **Signup/Signin**: Tokens are automatically stored in localStorage and cookies
2. **Request Interceptor**: Automatically adds Bearer token to all requests
3. **Response Interceptor**: Handles 401 errors by clearing tokens and redirecting to login
4. **Token Management**: `authAPI.isAuthenticated()` and `authAPI.getToken()` for status checks

## File Upload Handling

For APIs that handle file uploads (listings, agents):

```javascript
// Create FormData for file uploads
const formData = new FormData();
formData.append('title', 'Property Title');
formData.append('images', imageFile1);
formData.append('images', imageFile2);
formData.append('imageNames', 'image1.jpg');
formData.append('imageNames', 'image2.jpg');

// API automatically handles multipart/form-data
const result = await listingAPI.createListing(formData);
```

## Best Practices

1. **Use React Query hooks** for data fetching and caching
2. **Handle errors gracefully** with try-catch blocks
3. **Use loading states** from React Query mutations
4. **Invalidate queries** after mutations to keep data fresh
5. **Use TypeScript** for better type safety (recommended)

## Testing

All APIs can be tested using the provided functions:

```javascript
// Test authentication
const authResult = await authAPI.signin({ email: 'test@example.com', password: 'password' });

// Test listing creation
const listingResult = await listingAPI.createListing(testData);

// Test point balance
const balance = await pointAPI.getPointBalance();
```

This implementation provides a complete, production-ready API interface for the Proty frontend application.
