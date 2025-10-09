# Authorization Fix for Listing Updates and Deletes

## Problem
`TypeError: Cannot read properties of undefined (reading 'toString')` occurred when trying to update or delete listings.

## Root Cause
1. **req.user was undefined** - The error handling didn't check if `req.user` existed before accessing its properties
2. **JWT token structure mismatch** - JWT tokens are signed with `{ id: user._id }`, so the decoded token has `req.user.id` (not `req.user._id`)
3. **Inconsistent string comparison** - MongoDB ObjectIds need to be converted to strings for proper comparison

## Solution

### 1. Added Authentication Check
```javascript
// Check if user is authenticated
if (!req.user) {
  return next(errorHandler(401, 'You must be logged in to update listings!'));
}
```

### 2. Proper User ID Extraction
```javascript
// Get user ID from req.user (could be req.user.id or req.user._id)
const userId = req.user.id || req.user._id?.toString();
```

### 3. Robust String Comparison
```javascript
// Convert to strings for proper comparison
const listingUserRef = listing.userRef?.toString();
const listingAgentId = listing.agentId?.toString();

const isAuthorized = 
  (listingUserRef && userId === listingUserRef) || // Old system
  (listingAgentId && userId === listingAgentId); // New system
```

### 4. Debug Logging
Added console.log statements to help debug authorization failures:
```javascript
if (!isAuthorized) {
  console.log('Authorization failed:', {
    userId,
    listingUserRef,
    listingAgentId,
    reqUser: req.user
  });
  return next(errorHandler(401, 'You can only update your own listings!'));
}
```

## Files Modified
- `/api/controllers/listing.controller.js`
  - Updated `updateListing` function
  - Updated `deleteListing` function

## Testing
After these fixes:
- ✅ Mark Sold/Unsold works without errors
- ✅ Delete property works without errors
- ✅ Edit property works without errors
- ✅ Proper authorization checks in place
- ✅ No more "Cannot read properties of undefined" errors

## JWT Token Structure
The JWT token is signed with:
```javascript
jwt.sign({ id: validUser._id }, 'secret_key')
```

When decoded, `req.user` will have:
```javascript
{
  id: "507f1f77bcf86cd799439011" // MongoDB ObjectId as string
}
```

NOT:
```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439011")
}
```

## Authorization Flow
1. Token is sent in `Authorization: Bearer <token>` header
2. `verifyToken` middleware decodes the token and sets `req.user = { id: "..." }`
3. Controller extracts `userId` from `req.user.id`
4. Controller compares `userId` with listing's `agentId` or `userRef`
5. If match found, authorization succeeds

## Backward Compatibility
The solution supports both:
- **Old system**: Uses `listing.userRef` field
- **New system**: Uses `listing.agentId` field (MongoDB ObjectId reference)

