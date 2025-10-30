const Review = require('../models/review.model');
const Listing = require('../models/listing.model');
const logger = require('../utils/logger');

const createReview = async (req, res) => {
  try {
    const { name, email, review, rating, userId, propertyId } = req.body;

    if (!name || !email || !review) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingReview = await Review.findOne({ email });
    if (existingReview) {
      return res.status(400).json({ message: 'Review with this email already exists' });
    }

    const newReview = new Review({ 
      name, 
      email, 
      review,
      rating: rating || 5, // Use provided rating or default to 5
      propertyId,
      userId: userId || null // Add userId if provided
    });
    await newReview.save();

    res.status(201).json({ message: 'Review created', review: newReview });
  } catch (error) {
    logger.error('Error creating review:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const likeReview = async (req, res) => {
    try {
      const { reviewId, userId } = req.body; // userId from authenticated user ideally
  
      if (!reviewId || !userId) {
        return res.status(400).json({ message: 'reviewId and userId are required' });
      }
  
      const review = await Review.findById(reviewId);
      if (!review) {
        return res.status(404).json({ message: 'Review not found' });
      }
  
      // Remove user from dislikedBy if present
      review.dislikedBy = review.dislikedBy.filter(id => id.toString() !== userId);
  
      // Add user to likedBy if not already there
      if (!review.likedBy.some(id => id.toString() === userId)) {
        review.likedBy.push(userId);
      }
  
      await review.save();
  
      res.status(200).json({ message: 'Review liked', likes: review.likedBy.length, dislikes: review.dislikedBy.length });
    } catch (error) {
      logger.error('Error liking review:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  const dislikeReview = async (req, res) => {
    try {
      const { reviewId, userId } = req.body;
  
      if (!reviewId || !userId) {
        return res.status(400).json({ message: 'reviewId and userId are required' });
      }
  
      const review = await Review.findById(reviewId);
      if (!review) {
        return res.status(404).json({ message: 'Review not found' });
      }
  
      // Remove user from likedBy if present
      review.likedBy = review.likedBy.filter(id => id.toString() !== userId);
  
      // Add user to dislikedBy if not already there
      if (!review.dislikedBy.some(id => id.toString() === userId)) {
        review.dislikedBy.push(userId);
      }
  
      await review.save();
  
      res.status(200).json({ message: 'Review disliked', likes: review.likedBy.length, dislikes: review.dislikedBy.length });
    } catch (error) {
      logger.error('Error disliking review:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };

const getReviews = async (req, res) => {
  try {
    // Get pagination parameters from query
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const totalReviews = await Review.countDocuments();
    const totalPages = Math.ceil(totalReviews / limit);

    // Get paginated reviews
    const reviews = await Review.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('userId', 'username email avatar')
      .populate('propertyId', 'propertyKeyword address propertyPrice images');

    res.status(200).json({
      success: true,
      data: reviews,
      pagination: {
        currentPage: page,
        totalPages,
        totalReviews,
        limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    });
  } catch (error) {
    logger.error('Error creating review:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
const getReviewsByProperty = async (req, res) => {
    try {
      const { propertyId } = req.params;
  
      if (!propertyId) {
        return res.status(400).json({ message: 'propertyId is required' });
      }
  
      // Get all reviews for this property (excluding hidden from listing)
      const reviews = await Review.find({ 
        propertyId,
        hiddenFromListing: { $ne: true }
      }).sort({ createdAt: -1 });

      logger.debug(`Found ${reviews.length} reviews for property ${propertyId}`);
  
      res.status(200).json({
        success: true,
        data: reviews
      });
    } catch (error) {
      logger.error('Error deleting review:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };

  const getReviewsByAgent = async (req, res) => {
    try {
      let { agentId } = req.params;
  
      if (!agentId) {
        return res.status(400).json({ 
          success: false,
          message: 'agentId is required' 
        });
      }

      const mongoose = require('mongoose');
      const User = require('../models/user.model');
      
      // Convert to ObjectId
      const isObjectId = mongoose.Types.ObjectId.isValid(agentId);
      const agentIdObj = isObjectId ? new mongoose.Types.ObjectId(agentId) : agentId;

      // Get pagination parameters from query
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
  
      // Query reviews by agentId directly (if using new model) OR by property agentId
      // Try direct agentId first
      let reviews;
      let totalReviews;
      
      // Check if reviews have agentId field populated
      const directReviews = await Review.find({ agentId: agentIdObj }).limit(1);
      
      if (directReviews.length > 0) {
        // Use direct agentId query
        totalReviews = await Review.countDocuments({ 
          agentId: agentIdObj,
          hiddenFromDashboard: { $ne: true }
        });
        
        reviews = await Review.find({ 
          agentId: agentIdObj,
          hiddenFromDashboard: { $ne: true }
        })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .populate('userId', 'username email avatar')
          .populate('propertyId', 'propertyKeyword address propertyPrice images');
        
      } else {
        // Fallback: Find through properties
        const properties = await Listing.find({ 
          agentId: agentIdObj,
          isDeleted: { $ne: true }
        }).select('_id propertyKeyword');
        
        const propertyIds = properties.map(p => p._id);
        
        if (propertyIds.length === 0) {
          return res.status(200).json({
            success: true,
            data: [],
            stats: {
              totalReviews: 0,
              averageRating: 0,
              totalProperties: 0
            },
            pagination: {
              currentPage: page,
              totalPages: 0,
              totalReviews: 0,
              limit
            }
          });
        }
        
        totalReviews = await Review.countDocuments({ 
          propertyId: { $in: propertyIds },
          hiddenFromDashboard: { $ne: true }
        });
        
        reviews = await Review.find({ 
          propertyId: { $in: propertyIds },
          hiddenFromDashboard: { $ne: true }
        })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .populate('userId', 'username email avatar')
          .populate('propertyId', 'propertyKeyword address propertyPrice images');
      }
      
      const totalPages = Math.ceil(totalReviews / limit);
      
      // Calculate statistics
      const allReviews = await Review.find({ 
        agentId: agentIdObj,
        hiddenFromDashboard: { $ne: true }
      });
      
      const averageRating = allReviews.length > 0
        ? allReviews.reduce((sum, review) => sum + (review.rating || 0), 0) / allReviews.length
        : 0;
  
      res.status(200).json({
        success: true,
        data: reviews,
        stats: {
          totalReviews: allReviews.length,
          averageRating: Math.round(averageRating * 10) / 10,
          totalProperties: 0 // Can be calculated from properties if needed
        },
        pagination: {
          currentPage: page,
          totalPages,
          totalReviews,
          limit,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1
        }
      });
    } catch (error) {
      logger.error('Error in getReviewsByAgent:', error);
      res.status(500).json({ 
        success: false,
        message: 'Server error',
        error: error.message 
      });
    }
  };

  // Get reviews written BY a specific user
  const getReviewsByUser = async (req, res) => {
    try {
      const { userId } = req.params;
  
      if (!userId) {
        return res.status(400).json({ message: 'userId is required' });
      }
  
      // Find reviews by userId OR email (for backward compatibility)
      const reviews = await Review.find({ 
        $or: [
          { userId: userId },
          { email: req.query.email } // Optional: pass email as query param for legacy data
        ]
      })
      .sort({ createdAt: -1 })
      .populate('userId', 'username email avatar')
      .populate('propertyId', 'propertyKeyword address propertyPrice');
  
      res.status(200).json(reviews);
    } catch (error) {
      logger.error('Error getting reviews:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };

  // Hide review from dashboard
  const hideReviewFromDashboard = async (req, res) => {
    try {
      const { reviewId } = req.params;
      const { hidden } = req.body; // true to hide, false to show

      const review = await Review.findByIdAndUpdate(
        reviewId,
        { hiddenFromDashboard: hidden },
        { new: true }
      );

      if (!review) {
        return res.status(404).json({ message: 'Review not found' });
      }

      res.status(200).json({
        success: true,
        message: hidden ? 'Review hidden from dashboard' : 'Review shown on dashboard',
        data: review
      });
    } catch (error) {
      logger.error('Error hiding review from dashboard:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };

  // Hide review from listing
  const hideReviewFromListing = async (req, res) => {
    try {
      const { reviewId } = req.params;
      const { hidden } = req.body; // true to hide, false to show

      const review = await Review.findByIdAndUpdate(
        reviewId,
        { hiddenFromListing: hidden },
        { new: true }
      );

      if (!review) {
        return res.status(404).json({ message: 'Review not found' });
      }

      res.status(200).json({
        success: true,
        message: hidden ? 'Review hidden from listing' : 'Review shown on listing',
        data: review
      });
    } catch (error) {
      logger.error('Error hiding review from listing:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };

  module.exports ={
    getReviews,
    getReviewsByProperty,
    createReview,
    getReviewsByAgent,
    getReviewsByUser,
    likeReview,
    dislikeReview,
    hideReviewFromDashboard,
    hideReviewFromListing
  }
  