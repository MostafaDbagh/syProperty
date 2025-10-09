const Listing = require('../models/listing.model');

const filterListings = async (req, res, next) => {
  try {
    const {
      status,
      state,
      bedrooms,
      bathrooms,
      priceMin,
      priceMax,
      sizeMin,
      sizeMax,
      neighborhood,
      furnished,
      garages,
      amenities,
      keyword,
      rentType,
      offer,
      propertyType,
      propertyId,
      agentId,
    } = req.query;

    const filters = {};

    // Exact matches
    if (status) filters.status = status;
    if (state) filters.state = state;
    if (neighborhood) filters.neighborhood = neighborhood;
    if (rentType) filters.rentType = rentType;
    if (propertyType) filters.propertyType = propertyType;
    if (propertyId) filters.propertyId = propertyId;
    if (agentId) filters.agentId = agentId;
    if (offer !== undefined) filters.offer = offer === 'true';
    if (furnished !== undefined) filters.furnished = furnished === 'true';
    if (garages !== undefined) filters.garages = garages === 'true';

    // Numeric filters
    if (bedrooms) filters.bedrooms = +bedrooms;
    if (bathrooms) filters.bathrooms = +bathrooms;

    if (priceMin || priceMax) {
      filters.propertyPrice = {};
      if (priceMin) filters.propertyPrice.$gte = +priceMin;
      if (priceMax) filters.propertyPrice.$lte = +priceMax;
    }

    if (sizeMin || sizeMax) {
      filters.size = {};
      if (sizeMin) filters.size.$gte = +sizeMin;
      if (sizeMax) filters.size.$lte = +sizeMax;
    }

    // Keyword (search in both keyword and description)
    if (keyword) {
      filters.$or = [
        { propertyKeyword: { $regex: keyword, $options: 'i' } },
        { propertyDesc: { $regex: keyword, $options: 'i' } }
      ];
    }

    // Amenities (match all selected)
    if (amenities) {
      const amenitiesArray = Array.isArray(amenities)
        ? amenities
        : amenities.split(',');
      filters.amenities = { $all: amenitiesArray };
    }

    // Store filters in request object for the controller to use
    req.filter = filters;
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
};

module.exports = filterListings;
