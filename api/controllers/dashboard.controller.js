const Listing = require('../models/listing.model');
const Review = require('../models/review.model');
const Favorite = require('../models/favorite.model');
const Message = require('../models/message.model');
const Point = require('../models/point.model');
const errorHandler = require('../utils/error');

// Get dashboard statistics for an agent
const getDashboardStats = async (req, res, next) => {
  try {
    const agentId = req.user.id;
    
    // Get total listings count
    const totalListings = await Listing.countDocuments({ 
      agentId, 
      isDeleted: { $ne: true } 
    });
    
    // Get pending listings count
    const pendingListings = await Listing.countDocuments({ 
      agentId, 
      approvalStatus: 'pending',
      isDeleted: { $ne: true }
    });
    
    // Get approved listings count
    const approvedListings = await Listing.countDocuments({ 
      agentId, 
      approvalStatus: 'approved',
      isDeleted: { $ne: true }
    });
    
    // Get total reviews count for agent's properties
    const agentListings = await Listing.find({ 
      agentId, 
      isDeleted: { $ne: true } 
    }).select('_id');
    
    const listingIds = agentListings.map(listing => listing._id);
    const totalReviews = await Review.countDocuments({ 
      propertyId: { $in: listingIds } 
    });
    
    // Get total favorites count for the current user (how many properties they favorited)
    const totalFavorites = await Favorite.countDocuments({ 
      userId: agentId 
    });
    
    // Get unread messages count
    const unreadMessages = await Message.countDocuments({ 
      agentId, 
      isRead: false 
    });
    
    // Get total messages count
    const totalMessages = await Message.countDocuments({ agentId });
    
    // Get point balance
    let pointBalance = 0;
    const userPoints = await Point.findOne({ userId: agentId });
    if (userPoints) {
      pointBalance = userPoints.balance;
    }
    
    // Calculate listing limit (assuming 50 is the limit)
    const listingLimit = 50;
    const remainingListings = Math.max(0, listingLimit - totalListings);
    
    const dashboardData = {
      balance: {
        amount: pointBalance,
        currency: 'USD'
      },
      listings: {
        total: totalListings,
        approved: approvedListings,
        pending: pendingListings,
        remaining: remainingListings,
        limit: listingLimit
      },
      reviews: {
        total: totalReviews
      },
      favorites: {
        total: totalFavorites
      },
      messages: {
        total: totalMessages,
        unread: unreadMessages
      }
    };
    
    res.status(200).json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    next(error);
  }
};

// Get dashboard analytics (most visited listings, recent activity, etc.)
const getDashboardAnalytics = async (req, res, next) => {
  try {
    const agentId = req.user.id;
    
    // Get most visited listings
    const mostVisitedListings = await Listing.find({ 
      agentId, 
      isDeleted: { $ne: true } 
    })
    .sort({ visitCount: -1 })
    .limit(5)
    .select('propertyKeyword propertyPrice visitCount approvalStatus createdAt images');
    
    // Get recent messages
    const recentMessages = await Message.find({ agentId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('senderName messageContent createdAt isRead');
    
    // Get recent reviews
    const agentListings = await Listing.find({ 
      agentId, 
      isDeleted: { $ne: true } 
    }).select('_id');
    
    const listingIds = agentListings.map(listing => listing._id);
    const recentReviews = await Review.find({ 
      propertyId: { $in: listingIds } 
    })
    .sort({ createdAt: -1 })
    .limit(5)
    .select('reviewerName reviewText rating createdAt');
    
    res.status(200).json({
      success: true,
      data: {
        mostVisitedListings,
        recentMessages,
        recentReviews
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getDashboardAnalytics
};
