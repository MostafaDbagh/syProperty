# Holiday Homes Requirements

## Mandatory Rules for Holiday Homes

When creating or updating properties with `propertyType: "Holiday Home"`, the following rules MUST be enforced:

### 1. Status - RENT ONLY
```javascript
status: "rent"  // ONLY rent, no sale option allowed
```

### 2. Furnished - ALWAYS TRUE
```javascript
furnished: true  // Must always be true for Holiday Homes
```

### 3. Property Type
```javascript
propertyType: "Holiday Home"
```

## Implementation Checklist

When working with Holiday Homes:
- ✅ Verify `status === 'rent'` (never 'sale')
- ✅ Verify `furnished === true` (always true)
- ✅ Verify `propertyType === 'Holiday Home'`

## Database Enforcement

All Holiday Homes should have:
- `status`: "rent" (mandatory)
- `furnished`: true (mandatory)
- `propertyType`: "Holiday Home"

## Current Status
- Total Holiday Homes: 13
- All have status: "rent"
- All have furnished: true
- Last Updated: $(date)

## Validation Rules

When validating a property:
1. If `propertyType === "Holiday Home"`:
   - Set `status` to "rent" automatically
   - Set `furnished` to `true` automatically
2. Do not allow status="sale" for Holiday Homes
3. Do not allow furnished=false for Holiday Homes

## API Endpoints to Update

Ensure these endpoints enforce the rules:
- POST `/api/listing` (create property)
- PUT `/api/listing/:id` (update property)
- PATCH `/api/listing/:id` (partial update)

## Frontend Considerations

- Filter/search should only show "For Rent" for Holiday Homes
- Property creation form should enforce these rules
- Display Holiday Homes as rental properties only

