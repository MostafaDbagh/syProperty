# Agent Data Filtering Implementation Guide

## Overview
This guide explains how to filter data (listings, reviews, favorites) based on the logged-in agent using **MongoDB ObjectId references** instead of email fields.

## Why ObjectId References > Email Fields?

### ❌ Using Email (Your Suggestion)
```javascript
// BAD APPROACH
user: {
  email: "agent@example.com",
  agentEmail: "agent@example.com" // Redundant!
}

// Filtering
listings.find({ agentEmail: user.email })
```

**Problems:**
- ❌ Emails can change
- ❌ Slower queries (string comparison)
- ❌ No database indexing optimization
- ❌ Redundant data storage
- ❌ Not the MongoDB standard

### ✅ Using ObjectId References (Recommended)
```javascript
// GOOD APPROACH
user: {
  _id: ObjectId("507f1f77bcf86cd799439011"),
  email: "agent@example.com"
}

listing: {
  agentId: ObjectId("507f1f77bcf86cd799439011"), // References user._id
  agent: "agent@example.com" // Keep for backward compatibility
}

// Filtering
listings.find({ agentId: user._id })
```

**Benefits:**
- ✅ Unique and unchangeable
- ✅ Faster queries (indexed by default)
- ✅ MongoDB best practice
- ✅ Can populate agent details easily
- ✅ Industry standard approach

---

## Schema Changes Made

### 1. Listing Model (`listing.model.js`)
```javascript
{
  agent: { type: String, required: true }, // LEGACY - keep for old data
  agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // NEW FIELD
  // ... other fields
}
```

### 2. Review Model (`review.model.js`)
```javascript
{
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true }, // NEW
  email: { type: String }, // Keep for backward compatibility
  // ... other fields
}
```

### 3. Favorite Model (`favorite.model.js`)
```javascript
{
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // ✅ Already correct!
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing' },
}
```

---

## Implementation Guide

### Step 1: Update Frontend - Add Property Form

When creating a new listing, pass the user's `_id` as `agentId`:

```javascript
// proty-nextjs/components/dashboard/AddProperty.jsx
const handleSubmit = async (e) => {
  e.preventDefault();
  
  const user = JSON.parse(localStorage.getItem('user'));
  
  const listingData = {
    ...formData,
    agent: user.email, // Legacy field
    agentId: user._id, // NEW FIELD - User's ObjectId
    userId: user._id   // Alternative name
  };
  
  await listingAPI.createListing(listingData);
};
```

### Step 2: Update Frontend - My Properties Page

Filter listings by logged-in agent's `_id`:

```javascript
// proty-nextjs/app/(dashboard)/my-property/page.jsx
const MyPropertyPage = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?._id;
  
  // Fetch listings for this agent
  const { data: listings } = useQuery({
    queryKey: ['agent-listings', userId],
    queryFn: () => listingAPI.getListingsByAgent(userId),
    enabled: !!userId
  });
  
  return (
    <div>
      <h1>My Properties</h1>
      {listings?.map(listing => (
        <PropertyCard key={listing._id} listing={listing} />
      ))}
    </div>
  );
};
```

### Step 3: Update Frontend - Reviews

When creating a review, pass the user's `_id`:

```javascript
// When submitting a review
const submitReview = async (reviewData) => {
  const user = JSON.parse(localStorage.getItem('user'));
  
  const payload = {
    ...reviewData,
    userId: user._id, // NEW FIELD
    email: user.email, // Keep for backward compatibility
    name: user.username
  };
  
  await reviewAPI.createReview(payload);
};
```

### Step 4: Backend API Endpoints

The backend is already updated to support both fields:

#### Get Agent's Listings
```javascript
// GET /api/listing/agent/:agentId
// Returns all listings where agent === agentId OR agentId === agentId

const getMyListings = async () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const response = await axios.get(`/api/listing/agent/${user._id}`);
  return response.data;
};
```

#### Get User's Reviews
```javascript
// GET /api/review/user/:userId (you'll need to create this)
const getMyReviews = async () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const response = await axios.get(`/api/review/user/${user._id}`);
  return response.data;
};
```

#### Get User's Favorites
```javascript
// GET /api/favorites/user/:userId (already exists!)
const getMyFavorites = async () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const response = await axios.get(`/api/favorites/user/${user._id}`);
  return response.data;
};
```

---

## API Routes to Create/Update

### 1. Get User's Reviews
```javascript
// api/controllers/review.controller.js
const getReviewsByUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const reviews = await Review.find({ 
      $or: [
        { userId: userId },
        { email: req.query.email } // Fallback for legacy data
      ]
    })
    .sort({ createdAt: -1 })
    .populate('userId', 'username email avatar');
    
    res.status(200).json(reviews);
  } catch (error) {
    next(error);
  }
};
```

```javascript
// api/routes/review.route.js
router.get('/user/:userId', getReviewsByUser);
```

---

## Migration Strategy

Since you have existing data with `agent` as a string, here's how to migrate:

### Option 1: Gradual Migration (Recommended)
1. ✅ Keep both `agent` (string) and `agentId` (ObjectId) fields
2. ✅ New listings use `agentId`
3. ✅ Queries check both fields: `{ $or: [{ agent: id }, { agentId: id }] }`
4. ✅ No data loss, backward compatible

### Option 2: One-time Migration Script
```javascript
// api/scripts/migrate-agent-fields.js
const User = require('./models/user.model');
const Listing = require('./models/listing.model');

async function migrateAgentFields() {
  const listings = await Listing.find({ agentId: null });
  
  for (const listing of listings) {
    // Find user by email (stored in 'agent' field)
    const user = await User.findOne({ email: listing.agent });
    
    if (user) {
      listing.agentId = user._id;
      await listing.save();
      console.log(`✅ Migrated listing ${listing._id}`);
    }
  }
  
  console.log('Migration complete!');
}
```

---

## Frontend Implementation Checklist

### ✅ Add Property Page
- [ ] Pass `agentId: user._id` when creating listings
- [ ] Pass `userId: user._id` as alternative

### ✅ My Property Page
- [ ] Fetch listings using `GET /api/listing/agent/${user._id}`
- [ ] Display only agent's properties
- [ ] Show edit/delete buttons

### ✅ Reviews Page  
- [ ] Create endpoint `GET /api/review/user/${user._id}`
- [ ] Fetch user's reviews
- [ ] Pass `userId` when creating reviews

### ✅ Favorites Page
- [ ] Already working! Uses `userId` correctly
- [ ] Fetch using `GET /api/favorites/user/${user._id}`

---

## Summary

### What Changed:
1. ✅ Added `agentId` field to Listing model (ObjectId reference)
2. ✅ Added `userId` field to Review model (ObjectId reference)
3. ✅ Updated `getListingsByAgent` to support both fields
4. ✅ Kept legacy fields for backward compatibility

### What to Do Next:
1. Update Add Property form to pass `agentId: user._id`
2. Update My Property page to fetch by `user._id`
3. Create review endpoint to filter by `userId`
4. Test all flows

### Why This is Better:
- ✅ Uses MongoDB best practices
- ✅ Faster queries (indexed ObjectIds)
- ✅ Can populate user details easily
- ✅ More flexible and scalable
- ✅ Industry standard approach
- ✅ No need to modify User schema

**You're using the database the right way!** 🚀

