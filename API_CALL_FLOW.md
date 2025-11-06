# Add Property API Call Flow

## Complete Request Flow When User Clicks "Add Property"

### 1. Frontend - User Action
**File:** `proty-nextjs/components/dashboard/AddProperty.jsx`

```javascript
// Line 688: User clicks button
<button type="submit" onClick={handleSubmit}>
  Add Property
</button>

// Line 190: handleSubmit() is triggered
const handleSubmit = async (e) => {
  e.preventDefault();
  
  // 1. Validate form
  if (!validateForm()) { return; }
  
  // 2. Check user authentication
  if (!user) { return; }
  
  // 3. Prepare submitData (lines 215-235)
  const submitData = {
    ...formData,
    city: formData.state || formData.city || "Aleppo",
    propertyPrice: parseFloat(formData.propertyPrice),
    bedrooms: parseInt(formData.bedrooms),
    bathrooms: parseInt(formData.bathrooms),
    size: parseInt(formData.size),
    images: images, // Array of File objects
    imageNames: images.map(img => img.name),
    // ... other fields
  };
  
  // 4. Make API call (line 239)
  const result = await createListingMutation.mutateAsync(submitData);
}
```

### 2. Frontend - React Query Hook
**File:** `proty-nextjs/apis/hooks.js`

```javascript
// Line 86-95: useCreateListing hook
export const useCreateListing = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: listingAPI.createListing, // Calls API function
    onSuccess: () => {
      queryClient.invalidateQueries(['listings']); // Refresh cache
    },
  });
};
```

### 3. Frontend - API Service
**File:** `proty-nextjs/apis/listing.js`

```javascript
// Line 26-79: createListing function
createListing: async (listingData) => {
  const formData = new FormData();
  
  // Convert all data to FormData
  Object.keys(listingData).forEach(key => {
    const value = listingData[key];
    
    if (key === 'images' && Array.isArray(value)) {
      // Append File objects
      value.forEach((image) => {
        if (image instanceof File) {
          formData.append('images', image);
        }
      });
    } else if (key === 'amenities' && Array.isArray(value)) {
      // Append array items as repeated keys
      value.forEach((amenity) => {
        formData.append('amenities', amenity);
      });
    } else if (typeof value === 'boolean') {
      formData.append(key, value.toString());
    } else {
      formData.append(key, value);
    }
  });
  
  // Make POST request
  const response = await Axios.post('/listing/create', formData);
  return response.data;
}
```

### 4. Axios Configuration
**File:** `proty-nextjs/axios/index.js`

```javascript
// Base URL: http://localhost:5500/api
// Automatically adds Authorization header with Bearer token
// Sets Content-Type: multipart/form-data with boundary
POST /api/listing/create
Headers:
  Authorization: Bearer <token>
  Content-Type: multipart/form-data; boundary=----WebKitFormBoundary...
Body: FormData with fields + files
```

### 5. Backend - Express Route
**File:** `api/routes/listing.route.js`

```javascript
// Line 19: Route definition
router.post('/create', 
  verifyToken,                    // 1. Authenticate user
  uploadListingImages,            // 2. Parse multipart/form-data
  handleMulterError,              // 3. Handle Multer errors
  uploadListingImagesMiddleware,  // 4. Upload to Cloudinary
  checkAndDeductPoints,           // 5. Check user points
  ListingController.createListing, // 6. Create listing
  deductPointsAfterListing         // 7. Deduct points
);
```

### 6. Backend - Multer Middleware
**File:** `api/utils/uploadListingImages.js`

```javascript
// uploadListingImages (line 72-115)
- Initializes req.body = {}
- Uses multer.any() to parse ALL fields
- Filters files to 'images' field only
- Limits to 7 images max
- Logs parsed data

// uploadListingImagesMiddleware (line 118-186)
- Uploads each image to Cloudinary
- Stores: { publicId, url, filename, uploadedAt }
- Attaches to req.body.images
- Attaches imageNames to req.body.imageNames
```

### 7. Backend - Controller
**File:** `api/controllers/listing.controller.js`

```javascript
// createListing (line 49-156)
- Validates required fields
- Type conversions:
  * toNumber() for numeric fields
  * toBoolean() for boolean fields
  * toArray() for array fields
- Maps state → city
- Handles amenities array
- Creates Listing document in MongoDB
- Returns success response with listing data
```

### 8. Backend - Response
```json
{
  "success": true,
  "_id": "...",
  "propertyId": "PROP_1234567890",
  "propertyType": "Apartment",
  "images": [
    {
      "publicId": "listings/xyz",
      "url": "https://res.cloudinary.com/...",
      "filename": "image1.jpg",
      "uploadedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pointsInfo": { ... }
}
```

### 9. Frontend - Success Handling
**File:** `proty-nextjs/components/dashboard/AddProperty.jsx`

```javascript
// Success (line 239-277)
try {
  const result = await createListingMutation.mutateAsync(submitData);
  
  // Show success toast
  setToast({ 
    type: "success", 
    message: "Property created successfully!" 
  });
  
  // Reset form
  setFormData({ ...defaultValues });
  setImages([]);
  
  // Redirect after 2 seconds
  setTimeout(() => router.push("/my-property"), 2000);
  
} catch (error) {
  // Error handling (line 279-300)
  // Show error toast
  // Handle insufficient points error
}
```

## Key Points

1. **Data Flow:** Form → FormData → Multipart Request → Multer → Controller → Database
2. **Image Upload:** Files uploaded to Cloudinary before saving to database
3. **Type Conversion:** All data properly converted on backend
4. **Field Mapping:** Frontend `state` → Backend `city`
5. **Error Handling:** Comprehensive error handling at each step
6. **Authentication:** JWT token validated before processing
7. **Points System:** Points checked and deducted during creation

## Testing Checklist

- [ ] Form validation works
- [ ] Images are uploaded to Cloudinary
- [ ] All fields are saved correctly
- [ ] Type conversions work properly
- [ ] Error handling displays appropriate messages
- [ ] Success redirects to /my-property
- [ ] Points are deducted correctly
- [ ] Listing appears in database with all fields

