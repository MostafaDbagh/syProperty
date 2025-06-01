const Listing = require('../models/listing.model');
const Favorite = require('../models/favorite.model')
const { errorHandler } = require('../utils/error');

const addFavorite = async (req, res, next) => {
  try {
    const { propertyId } = req.body;
    const userId = req.user.id;

    // Check if property exists
    const listing = await Listing.findById(propertyId);
    if (!listing) return next(errorHandler(404, 'Property not found'));

    // Create or ignore if already exists
    const favorite = await Favorite.findOneAndUpdate(
      { userId, propertyId },
      { $setOnInsert: { addedAt: new Date() } },
      { new: true, upsert: true }
    );

    res.status(200).json(favorite);
  } catch (error) {
    next(error);
  }
};

const removeFavorite = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const propertyId = req.params.propertyId;

    const result = await Favorite.findOneAndDelete({ userId, propertyId });
    if (!result) return next(errorHandler(404, 'Favorite not found'));

    res.status(200).json({ message: 'Favorite removed successfully' });
  } catch (error) {
    next(error);
  }
};

const getFavorites = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const favorites = await Favorite.find({ userId }).populate('propertyId');

    res.status(200).json(favorites);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addFavorite,
  removeFavorite,
  getFavorites
};
