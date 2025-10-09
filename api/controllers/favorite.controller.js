const Listing = require('../models/listing.model');
const Favorite = require('../models/favorite.model')
const { errorHandler } = require('../utils/error');

const addFavorite = async (req, res, next) => {
  try {
    const { propertyId } = req.body;
    // Get user ID from req.user (could be req.user.id or req.user._id)
    const userId = req.user.id || req.user._id?.toString();

    if (!userId) {
      return next(errorHandler(401, 'User not authenticated'));
    }

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
    // Get user ID from req.user (could be req.user.id or req.user._id)
    const userId = req.user.id || req.user._id?.toString();
    const propertyId = req.params.propertyId;

    if (!userId) {
      return next(errorHandler(401, 'User not authenticated'));
    }

    const result = await Favorite.findOneAndDelete({ userId, propertyId });
    if (!result) return next(errorHandler(404, 'Favorite not found'));

    res.status(200).json({ message: 'Favorite removed successfully' });
  } catch (error) {
    next(error);
  }
};

const getFavorites = async (req, res, next) => {
  try {
    // Get user ID from req.user (could be req.user.id or req.user._id)
    const userId = req.user.id || req.user._id?.toString();

    if (!userId) {
      return next(errorHandler(401, 'User not authenticated'));
    }

    // Get pagination parameters from query
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const totalFavorites = await Favorite.countDocuments({ userId });
    const totalPages = Math.ceil(totalFavorites / limit);

    // Get paginated favorites
    const favorites = await Favorite.find({ userId })
      .populate('propertyId')
      .sort({ createdAt: -1 }) // Newest first
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: favorites,
      pagination: {
        currentPage: page,
        totalPages,
        totalFavorites,
        limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addFavorite,
  removeFavorite,
  getFavorites
};
