const Listing = require('../models/listing.model');
const Favorite = require('../models/favorite.model')
const { errorHandler } = require('../utils/error');
const jwt = require('jsonwebtoken');

// Helper function to get user ID from token
const getUserIdFromToken = (req) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || '5345jkj5kl34j5kl34j5');
      return decoded.id;
    } catch (error) {
      return null;
    }
  }
  return null;
};

const addFavorite = async (req, res, next) => {
  try {
    const { propertyId } = req.body;
    const userId = getUserIdFromToken(req) || req.user?.id || req.user?._id?.toString();

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
    const userId = getUserIdFromToken(req) || req.user?.id || req.user?._id?.toString();
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
    const userId = getUserIdFromToken(req) || req.user?.id || req.user?._id?.toString();

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

const isFavorited = async (req, res, next) => {
  try {
    const { propertyId } = req.params;
    const userId = getUserIdFromToken(req) || req.user?.id || req.user?._id?.toString();

    if (!userId) {
      return next(errorHandler(401, 'User not authenticated'));
    }

    if (!propertyId) {
      return next(errorHandler(400, 'Property ID is required'));
    }

    // Check if property is favorited
    const favorite = await Favorite.findOne({ userId, propertyId });
    
    res.status(200).json({
      success: true,
      isFavorited: !!favorite,
      favoriteId: favorite?._id || null
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addFavorite,
  removeFavorite,
  getFavorites,
  isFavorited
};
