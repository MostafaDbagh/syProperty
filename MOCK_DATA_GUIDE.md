# Mock Data Generation Guide

## 📦 What's Included

This guide provides scripts to generate **20+ mock data entries** for testing your agent data filtering system.

### Mock Data Summary:
- **10 Users** (5 agents + 5 regular users)
- **25 Listings** (distributed across agents)
- **30 Reviews** (from regular users on properties)
- **40 Favorites** (user favorites on properties)

---

## 🚀 How to Use

### Step 1: Make Sure Your Backend is Ready

1. MongoDB should be running
2. Your `.env` file should have `MONGO_URI` configured
3. All models should be updated (they already are!)

### Step 2: Run the Seed Script

```bash
cd api
node seed-mock-data.js
```

This will:
- ✅ Clear all existing data
- ✅ Create 10 users (agents + regular users)
- ✅ Create 25 property listings with `agentId` field
- ✅ Create 30 reviews with `userId` field
- ✅ Create 40 favorites
- ✅ Show you all login credentials

### Step 3: Test Your System!

Login with any of the agent accounts and test:
- My Properties page (filtered by agent)
- Reviews for agent properties
- User favorites
- Make Me Agent functionality

---

## 🔐 Test Account Credentials

**All users have the same password:** `password123`

### 👨‍💼 Agent Accounts:
- `john@agent.com` - John Agent (Premium package, 100 points)
- `sarah@realtor.com` - Sarah Realtor (Enterprise package, 150 points)
- `mike@properties.com` - Mike Properties (Basic package, 80 points)
- `emma@homes.com` - Emma Homes (Premium package, 120 points)
- `david@estates.com` - David Estates (Basic package, 90 points)

### 👤 Regular User Accounts:
- `alice@buyer.com` - Alice Buyer
- `bob@renter.com` - Bob Renter
- `charlie@investor.com` - Charlie Investor
- `diana@seeker.com` - Diana Seeker
- `evan@client.com` - Evan Client

---

## 🧪 What to Test

### 1. Agent Property Filtering
```
1. Login as john@agent.com
2. Go to "My Properties" page
3. Should see ONLY John's 5 listings
4. Logout and login as sarah@realtor.com
5. Should see ONLY Sarah's 5 listings
```

### 2. Reviews for Agent Properties
```
1. Login as john@agent.com
2. Go to "Reviews" page
3. Should see reviews ONLY for John's properties
4. Reviews are written by regular users (Alice, Bob, etc.)
```

### 3. User Favorites
```
1. Login as alice@buyer.com (regular user)
2. Go to "My Favorites" page
3. Should see Alice's favorite properties
4. Can favorite/unfavorite properties
```

### 4. Make Me Agent Flow
```
1. Login as alice@buyer.com (regular user)
2. Click "Make Me Agent" button
3. User role updates from 'user' to 'agent'
4. Should now see agent features (Add Property, My Properties, etc.)
5. Create a new listing
6. Listing should have agentId = Alice's _id
7. Go to "My Properties"
8. Should see the newly created listing
```

---

## 📊 Data Structure

### Each Listing Has:
```javascript
{
  propertyId: "PROP-1001",
  propertyType: "Apartment",
  propertyKeyword: "Apartment in California",
  propertyDesc: "Beautiful apartment with modern amenities...",
  propertyPrice: 175000,
  status: "sale",
  bedrooms: 2,
  bathrooms: 1,
  size: 600,
  address: "101 Main Street, California",
  country: "USA",
  state: "California",
  agent: "john@agent.com",        // Legacy field
  agentId: ObjectId("..."),        // NEW field - User's _id
  images: [...],                   // 3 random images per property
  // ... other fields
}
```

### Each Review Has:
```javascript
{
  propertyId: "PROP-1001",
  userId: ObjectId("..."),         // NEW field - User's _id
  name: "alice_buyer",
  email: "alice@buyer.com",
  review: "Great property! Very spacious...",
  likes: 25,
  dislikes: 3
}
```

### Each Favorite Has:
```javascript
{
  userId: ObjectId("..."),         // User's _id
  propertyId: ObjectId("..."),     // Listing's _id
  addedAt: Date(...)
}
```

---

## 🛠️ Available Scripts

### Seed Database (Create Mock Data)
```bash
node seed-mock-data.js
```
- Clears all existing data
- Creates fresh mock data
- Shows summary and login credentials

### Clear Database (Remove All Data)
```bash
node clear-mock-data.js
```
- Removes all users, listings, reviews, and favorites
- Shows count before clearing
- Useful for starting fresh

---

## 📝 Testing Checklist

### Backend Testing
- [ ] GET `/api/listing/agent/:agentId` - Returns agent's listings only
- [ ] GET `/api/review/user/:userId` - Returns user's reviews only
- [ ] GET `/api/favorites/user/:userId` - Returns user's favorites only
- [ ] POST `/api/listing` with `agentId` - Creates listing with agent reference
- [ ] POST `/api/review` with `userId` - Creates review with user reference

### Frontend Testing
- [ ] Login as agent → See "Add Property" button
- [ ] Login as user → See "Make Me Agent" button
- [ ] Agent can see only their properties in "My Properties"
- [ ] Agent can add new property
- [ ] User can favorite/unfavorite properties
- [ ] Reviews show on property detail pages
- [ ] Make Me Agent converts user to agent successfully
- [ ] After becoming agent, user can see agent features

---

## 🎯 Expected Results

### Agent John's Properties Count
```bash
# Should return 5 listings
GET /api/listing/agent/[john's_id]
```

### User Alice's Favorites Count
```bash
# Should return 8 favorites (40 favorites / 5 users)
GET /api/favorites/user/[alice's_id]
```

### Reviews for Property Count
```bash
# Each property has 1-2 reviews
GET /api/review/property/[property_id]
```

---

## 🔄 Reset and Reseed

If you want to start over:

```bash
# Clear everything
node clear-mock-data.js

# Reseed with fresh data
node seed-mock-data.js
```

---

## 💡 Customization

Want to modify the mock data?

### Edit `seed-mock-data.js`:

**Add more users:**
```javascript
const users = [
  // Add your custom users here
  {
    username: 'your_agent',
    email: 'your@agent.com',
    role: 'agent',
    // ...
  }
];
```

**Add more listings:**
```javascript
// Change the loop count
for (let i = 0; i < 50; i++) { // Was 25
  // ...
}
```

**Customize property data:**
```javascript
const propertyTypes = ['Penthouse', 'Loft', 'Cottage']; // Add more types
const states = ['Miami', 'Seattle', 'Boston']; // Add more locations
```

---

## 🐛 Troubleshooting

### Error: Cannot connect to MongoDB
```bash
# Make sure MongoDB is running
mongod

# Or if using MongoDB Atlas, check your MONGO_URI in .env
```

### Error: Duplicate key error
```bash
# Clear the database first
node clear-mock-data.js

# Then reseed
node seed-mock-data.js
```

### Error: Module not found
```bash
# Install dependencies
npm install
```

---

## 📸 Visual Data Distribution

### Listings per Agent:
```
John Agent      ████████ 5 listings
Sarah Realtor   ████████ 5 listings
Mike Properties ████████ 5 listings
Emma Homes      ████████ 5 listings
David Estates   ████████ 5 listings
```

### Reviews per User:
```
Alice   ████████ 6 reviews
Bob     ████████ 6 reviews
Charlie ████████ 6 reviews
Diana   ████████ 6 reviews
Evan    ████████ 6 reviews
```

### Favorites per User:
```
Alice   ████████ 8 favorites
Bob     ████████ 8 favorites
Charlie ████████ 8 favorites
Diana   ████████ 8 favorites
Evan    ████████ 8 favorites
```

---

## 🎉 Summary

You now have:
- ✅ 10 test accounts (5 agents + 5 users)
- ✅ 25 property listings with proper agent references
- ✅ 30 reviews with user references
- ✅ 40 user favorites
- ✅ All data properly linked using ObjectId references
- ✅ Ready to test agent data filtering!

**Happy Testing! 🚀**

