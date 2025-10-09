# Advanced Search Enhancement - Property ID Search

## Overview
Added `propertyId` and `agentId` search parameters to the Advanced Search API.

---

## 🆕 New Search Parameters

### 1. Property ID Search
**Parameter:** `propertyId`  
**Type:** Exact match  
**Description:** Search for a specific property by its unique property ID

**Example:**
```bash
GET /api/listing/search?propertyId=PROP_1760012900119
```

**Response:**
```json
{
  "success": true,
  "total": 1,
  "data": [{
    "_id": "68e7aaaa3fefcd9b3ecd27fd",
    "propertyId": "PROP_1760012900119",
    "propertyKeyword": "Luxury Apartment",
    "propertyPrice": 1000,
    ...
  }]
}
```

### 2. Agent ID Search
**Parameter:** `agentId`  
**Type:** Exact match  
**Description:** Search for all properties belonging to a specific agent

**Example:**
```bash
GET /api/listing/search?agentId=68e773c98ddbe20b0ca5050f
```

**Response:**
```json
{
  "success": true,
  "total": 32,
  "data": [
    {
      "propertyId": "PROP_001",
      "agentId": "68e773c98ddbe20b0ca5050f",
      ...
    },
    ...
  ]
}
```

---

## 📋 Complete Search Parameters List

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `propertyId` | String | Exact property ID | `?propertyId=PROP_123` |
| `agentId` | String | Agent's MongoDB ID | `?agentId=68e773...` |
| `keyword` | String | Search in title & description | `?keyword=Luxury` |
| `status` | String | sale / rent | `?status=sale` |
| `state` | String | Location state | `?state=California` |
| `neighborhood` | String | Neighborhood name | `?neighborhood=Downtown` |
| `propertyType` | String | house, apartment, villa, etc. | `?propertyType=house` |
| `rentType` | String | daily, weekly, monthly, yearly | `?rentType=monthly` |
| `bedrooms` | Number | Exact number | `?bedrooms=3` |
| `bathrooms` | Number | Exact number | `?bathrooms=2` |
| `priceMin` | Number | Minimum price | `?priceMin=100000` |
| `priceMax` | Number | Maximum price | `?priceMax=500000` |
| `sizeMin` | Number | Minimum size (sqft) | `?sizeMin=1000` |
| `sizeMax` | Number | Maximum size (sqft) | `?sizeMax=2000` |
| `furnished` | Boolean | true / false | `?furnished=true` |
| `garages` | Boolean | true / false | `?garages=true` |
| `offer` | Boolean | Has special offer | `?offer=true` |
| `amenities` | String/Array | Comma-separated or array | `?amenities=pool,gym` |
| `page` | Number | Page number (default: 1) | `?page=2` |
| `limit` | Number | Results per page (default: 20) | `?limit=10` |
| `sort` | String | Sort field | `?sort=-createdAt` |

---

## 🔍 Search Examples

### Example 1: Search by Property ID
```bash
curl 'http://localhost:5500/api/listing/search?propertyId=PROP_1760012900119'
```

### Example 2: Search by Agent ID
```bash
curl 'http://localhost:5500/api/listing/search?agentId=68e773c98ddbe20b0ca5050f&limit=10'
```

### Example 3: Combined Search
```bash
curl 'http://localhost:5500/api/listing/search?propertyId=PROP_123&status=sale'
```

### Example 4: Agent's Sale Properties
```bash
curl 'http://localhost:5500/api/listing/search?agentId=68e773c98ddbe20b0ca5050f&status=sale'
```

### Example 5: Agent's Properties in California
```bash
curl 'http://localhost:5500/api/listing/search?agentId=68e773c98ddbe20b0ca5050f&state=California'
```

### Example 6: Search by Keyword
```bash
curl 'http://localhost:5500/api/listing/search?keyword=Luxury'
```

### Example 7: Price Range Search
```bash
curl 'http://localhost:5500/api/listing/search?priceMin=100000&priceMax=500000'
```

### Example 8: Full Advanced Search
```bash
curl 'http://localhost:5500/api/listing/search?status=sale&state=California&bedrooms=3&priceMin=200000&priceMax=500000&furnished=true&amenities=pool,gym'
```

---

## 🎯 Use Cases

### Use Case 1: Direct Property Lookup
When a user wants to find a specific property by its ID (e.g., from a bookmark or shared link):
```javascript
const response = await listingAPI.getListings({ propertyId: 'PROP_1760012900119' });
```

### Use Case 2: Agent Portfolio
Display all properties for a specific agent:
```javascript
const response = await listingAPI.getListings({ 
  agentId: '68e773c98ddbe20b0ca5050f',
  limit: 20,
  page: 1
});
```

### Use Case 3: Agent's Active Listings
Show only active (for sale/rent) properties for an agent:
```javascript
const response = await listingAPI.getListings({ 
  agentId: '68e773c98ddbe20b0ca5050f',
  status: 'sale'
});
```

---

## 🔧 Implementation Details

### File Modified:
- `api/middleware/listing.js`

### Changes Made:
1. Added `propertyId` parameter extraction from query
2. Added `agentId` parameter extraction from query
3. Added exact match filters for both parameters

### Code:
```javascript
const {
  // ... existing parameters
  propertyId,
  agentId,
} = req.query;

// Exact matches
if (propertyId) filters.propertyId = propertyId;
if (agentId) filters.agentId = agentId;
```

---

## ✅ Testing Results

### Test 1: Search by Property ID ✅
```bash
GET /api/listing/search?propertyId=PROP_1760012900119
```
**Result:** Found 1 property  
**Status:** PASSED

### Test 2: Search by Agent ID ✅
```bash
GET /api/listing/search?agentId=68e773c98ddbe20b0ca5050f
```
**Result:** Found 32 properties  
**Status:** PASSED

### Test 3: Combined Search ✅
```bash
GET /api/listing/search?propertyId=PROP_1760012900119&status=sale
```
**Result:** Found 1 property with correct status  
**Status:** PASSED

---

## 📊 Frontend Integration

### Update Frontend API Calls

**In `proty-nextjs/apis/listing.js`:**
```javascript
// Search by property ID
const property = await listingAPI.getListings({ propertyId: 'PROP_123' });

// Search by agent ID
const agentProperties = await listingAPI.getListings({ agentId: 'agent_id_here' });

// Combined search
const results = await listingAPI.getListings({
  propertyId: 'PROP_123',
  status: 'sale'
});
```

### Example Component Usage:
```javascript
// In a React component
const { data, isLoading } = useQuery({
  queryKey: ['property', propertyId],
  queryFn: () => listingAPI.getListings({ propertyId }),
  enabled: !!propertyId
});
```

---

## 🎨 UI Recommendations

### Add Property ID Search Field
```jsx
<input
  type="text"
  placeholder="Property ID (e.g., PROP_123)"
  value={searchParams.propertyId}
  onChange={(e) => setSearchParams({
    ...searchParams,
    propertyId: e.target.value
  })}
/>
```

### Quick Search Bar
```jsx
<div className="quick-search">
  <label>Quick Find by Property ID:</label>
  <input
    type="text"
    placeholder="Enter Property ID"
    onKeyPress={(e) => {
      if (e.key === 'Enter') {
        searchByPropertyId(e.target.value);
      }
    }}
  />
</div>
```

---

## 🚀 Benefits

1. ✅ **Direct Access**: Users can directly access properties by ID
2. ✅ **Agent Filtering**: Easy to filter all properties by agent
3. ✅ **Shareable Links**: Property IDs can be shared in URLs
4. ✅ **Better UX**: Faster property lookup
5. ✅ **Advanced Filtering**: Combine with other filters
6. ✅ **API Consistency**: Same search endpoint for all filters

---

## 📝 Notes

- **Exact Match**: Both propertyId and agentId use exact matching
- **Case Sensitive**: propertyId is case-sensitive
- **Backward Compatible**: Existing searches still work
- **No Breaking Changes**: Only adds new parameters
- **Performance**: Indexed fields for fast searching

---

## ✅ Status: COMPLETE

Both `propertyId` and `agentId` search parameters have been successfully added to the Advanced Search API and are working correctly!

**Test it now:**
```bash
curl 'http://localhost:5500/api/listing/search?propertyId=PROP_1760012900119'
```

