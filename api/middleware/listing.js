const Listing = require('../models/listing.model')
const filterListings = async (req, res) => {
    try {
      const {
        status,
        state,
        bedrooms,
        bathrooms,
        priceMin,
        priceMax,
        amenities,
        sizeMin,
        sizeMax,
        neighborhood,
        furnished,
        label,
        type
      } = req.query;
  
      const filters = {};
  
      if (status) filters.status = status;
      if (state) filters.state = state;
      if (bedrooms) filters.bedrooms = +bedrooms;
      if (bathrooms) filters.bathrooms = +bathrooms;
      if (furnished !== undefined) filters.furnished = furnished === 'true';
      if (label) filters.label = label;
      if (type) filters.type = type;
      if (neighborhood) filters.neighborhood = neighborhood;
  
      if (priceMin || priceMax) {
        filters.price = {};
        if (priceMin) filters.price.$gte = +priceMin;
        if (priceMax) filters.price.$lte = +priceMax;
      }
  
      if (sizeMin || sizeMax) {
        filters.size = {};
        if (sizeMin) filters.size.$gte = +sizeMin;
        if (sizeMax) filters.size.$lte = +sizeMax;
      }
  
      if (amenities) {
        const amenitiesArray = amenities.split(','); // e.g., ?amenities=Pool,Gym
        filters.amenities = { $all: amenitiesArray };
      }
  
      const listings = await Listing.find(filters);
      res.status(200).json(listings);

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server Error' });
    }
  };
  
  module.exports = filterListings;