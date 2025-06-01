const Review = require('../models/review.model');
const Listing = require('../models/listing.model');

const createReview = async (req, res) => {
  try {
    const { name, email, review } = req.body;

    if (!name || !email || !review) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingReview = await Review.findOne({ email });
    if (existingReview) {
      return res.status(400).json({ message: 'Review with this email already exists' });
    }

    const newReview = new Review({ name, email, review });
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
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.status(200).json(reviews);
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
      const properties = await Property.find({ agentId }).select('_id');
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

  module.exports ={
    getReviews,
    getReviewsByProperty,
    createReview,
    getReviewsByAgent,
    likeReview,
    dislikeReview
  }
  