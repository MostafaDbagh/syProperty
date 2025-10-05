# Point System API Documentation

## Overview
The point system allows users to purchase points and use them to publish property listings. Points are deducted based on various factors like property type, size, amenities, etc.

## API Endpoints

### 1. Get Point Balance
**GET** `/api/points/balance`
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
```json
{
  "success": true,
  "data": {
    "balance": 1000,
    "totalPurchased": 1500,
    "totalUsed": 500,
    "recentTransactions": [...]
  }
}
```

### 2. Charge Points (Purchase Points)
**POST** `/api/points/charge`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
```json
{
  "amount": 1000,
  "paymentMethod": "credit_card",
  "paymentReference": "txn_123456789"
}
```
- **Response**:
```json
{
  "success": true,
  "message": "Successfully charged 1000 points",
  "data": {
    "newBalance": 1000,
    "transaction": {...}
  }
}
```

### 3. Calculate Listing Cost
**POST** `/api/points/calculate-cost`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
```json
{
  "propertyType": "apartment",
  "bedrooms": 3,
  "bathrooms": 2,
  "size": 150,
  "amenities": ["parking", "garden", "pool"],
  "images": ["img1.jpg", "img2.jpg"]
}
```
- **Response**:
```json
{
  "success": true,
  "data": {
    "totalCost": 75,
    "breakdown": {
      "baseCost": 50,
      "typeMultiplier": 1.0,
      "sizeFactor": 1.0,
      "bedroomFactor": 1.0,
      "amenitiesFactor": 1.0,
      "imagesFactor": 1.0
    }
  }
}
```

### 4. Get Transaction History
**GET** `/api/points/transactions?page=1&limit=20`
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
```json
{
  "success": true,
  "data": {
    "transactions": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 50,
      "pages": 3
    }
  }
}
```

### 5. Create Listing (with Point Deduction)
**POST** `/api/listing/create`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: Standard listing data
- **Response**:
```json
{
  "success": true,
  "data": {
    "listing": {...},
    "pointsInfo": {
      "amount": 75,
      "newBalance": 925
    }
  }
}
```

## Point Calculation Factors

### Base Cost: 50 points

### Multipliers:
- **Property Type**:
  - Apartment: 1.0x
  - House: 1.2x
  - Villa: 1.5x
  - Commercial: 2.0x
  - Land: 0.8x

- **Size Factor**:
  - >200 sqm: +0.2x
  - >500 sqm: +0.3x
  - >1000 sqm: +0.5x

- **Bedroom Factor**:
  - >3 bedrooms: +0.1x
  - >5 bedrooms: +0.2x

- **Amenities Factor**:
  - >5 amenities: +0.2x
  - >10 amenities: +0.3x

- **Images Factor**:
  - >5 images: +0.1x
  - >10 images: +0.2x

## Example Calculations

### Basic Apartment (3 bed, 2 bath, 120 sqm, 3 amenities, 3 images)
- Base: 50 points
- Total: 50 points

### Large Villa (5 bed, 4 bath, 800 sqm, 8 amenities, 12 images)
- Base: 50 points
- Type: 1.5x (villa)
- Size: +0.3x (>500 sqm)
- Bedrooms: +0.1x (>3 bedrooms)
- Amenities: +0.2x (>5 amenities)
- Images: +0.2x (>10 images)
- Total: 50 × 1.5 × 1.3 × 1.1 × 1.2 × 1.2 = **154 points**

## Error Handling

### Insufficient Points
```json
{
  "success": false,
  "message": "Insufficient points. You need 150 points but only have 100",
  "requiredPoints": 150,
  "currentBalance": 100,
  "shortfall": 50
}
```

## Transaction Types
- `purchase`: User bought points
- `deduction`: Points used for listing
- `refund`: Points returned (listing deleted)
