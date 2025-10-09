const Review = require('../models/review.model');
const Listing = require('../models/listing.model');

const createReview = async (req, res) => {
  try {
    const { name, email, review, userId, propertyId } = req.body;

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
      propertyId,
      userId: userId || null // Add userId if provided
    });
    await newReview.save();

    res.status(201).json({ message: 'Review created', review: newReview });
  } catch (error) {
    console.error(error);
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
      console.error(error);
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
      console.error(error);
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
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
const getReviewsByProperty = async (req, res) => {
    try {
      const { propertyId } = req.params;
  
      if (!propertyId) {
        return res.status(400).json({ message: 'propertyId is required' });
      }
  
      const reviews = await Review.find({ propertyId }).sort({ createdAt: -1 });
  
      res.status(200).json(reviews);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };

  const getReviewsByAgent = async (req, res) => {
    try {
      const { agentId } = req.params;
  
      if (!agentId) {
        return res.status(400).json({ message: 'agentId is required' });
      }
  
      // Step 1: Find all properties for this agent
      const properties = await Listing.find({ 
        $or: [
          { agent: agentId },
          { agentId: agentId }
        ]
      }).select('_id');
      const propertyIds = properties.map(p => p._id);
  
      if (propertyIds.length === 0) {
        return res.status(200).json([]); // No properties means no reviews
      }
  
      // Step 2: Find all reviews for those properties
      const reviews = await Review.find({ propertyId: { $in: propertyIds } }).sort({ createdAt: -1 });
  
      res.status(200).json(reviews);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
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
      console.error(error);
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
    dislikeReview
  }
  