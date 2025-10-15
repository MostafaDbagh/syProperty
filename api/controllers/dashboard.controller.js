const mongoose = require('mongoose');
const User = require('../models/user.model');
const Listing = require('../models/listing.model');
const Favorite = require('../models/favorite.model');
const Review = require('../models/review.model');
const Message = require('../models/message.model');
const Point = require('../models/point.model');

/**
 * Get comprehensive dashboard statistics for an agent/user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;
    
    console.log('Dashboard Stats Request:', {
      userId,
      timestamp: new Date().toISOString()
    });

    // Get user details
    const user = await User.findById(userId).select('email firstName lastName isAgent pointBalance');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Parallel queries for better performance
    const [
      totalListings,
      pendingListings,
      approvedListings,
      totalFavorites,
      totalReviews,
      unreadMessages,
      totalMessages,
      pointBalance
    ] = await Promise.all([
      // Total listings by this user
      Listing.countDocuments({ 
        agentId: userId,
        isDeleted: { $ne: true }
      }),
      
      // Pending listings
      Listing.countDocuments({ 
        agentId: userId,
        approvalStatus: 'pending',
        isDeleted: { $ne: true }
      }),
      
      // Approved listings
      Listing.countDocuments({ 
        agentId: userId,
        approvalStatus: 'approved',
        isDeleted: { $ne: true }
      }),
      
      // Total favorites by this user
      Favorite.countDocuments({ 
        userId: userId
      }),
      
      // Total reviews for this user's listings (need to join with listings)
      Review.aggregate([
        {
          $addFields: {
            propertyObjectId: { $toObjectId: '$propertyId' }
          }
        },
        {
          $lookup: {
            from: 'listings',
            localField: 'propertyObjectId',
            foreignField: '_id',
            as: 'property'
          }
        },
        {
          $match: {
            'property.agentId': new mongoose.Types.ObjectId(userId)
          }
        },
        {
          $count: 'total'
        }
      ]).then(result => result[0]?.total || 0),
      
      // Unread messages for this agent
      Message.countDocuments({ 
        agentId: userId,
        status: 'unread'
      }),
      
      // Total messages for this agent
      Message.countDocuments({ 
        agentId: userId
      }),
      
      // Point balance
      Point.findOne({ userId: userId }).select('balance')
    ]);

    // Calculate additional metrics
    const listingLimit = user.isAgent ? 50 : 10; // Agents get 50, regular users get 10
    const remainingListings = Math.max(0, listingLimit - totalListings);
    
    // Get recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentActivity = await Promise.all([
      Listing.countDocuments({
        agentId: userId,
        createdAt: { $gte: sevenDaysAgo },
        isDeleted: { $ne: true }
      }),
      Favorite.countDocuments({
        userId: userId,
        createdAt: { $gte: sevenDaysAgo }
      }),
      Message.countDocuments({
        agentId: userId,
        createdAt: { $gte: sevenDaysAgo }
      })
    ]);

    // Calculate average rating for agent's properties
    const reviewsForAgent = await Review.aggregate([
      {
        $addFields: {
          propertyObjectId: { $toObjectId: '$propertyId' }
        }
      },
      {
        $lookup: {
          from: 'listings',
          localField: 'propertyObjectId',
          foreignField: '_id',
          as: 'property'
        }
      },
      {
        $match: {
          'property.agentId': new mongoose.Types.ObjectId(userId)
        }
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 }
        }
      }
    ]);
    
    const averageRating = reviewsForAgent.length > 0 ? reviewsForAgent[0].averageRating : 0;

    // Prepare response data
    const dashboardData = {
      // Core metrics
      balance: pointBalance?.balance || user.pointBalance || 0,
      totalListings,
      pendingListings,
      approvedListings,
      totalFavorites,
      totalReviews: reviewsForAgent.length > 0 ? reviewsForAgent[0].totalReviews : 0,
      averageRating: parseFloat(averageRating.toFixed(2)),
      unreadMessages,
      totalMessages,
      
      // Additional info
      listingLimit,
      remainingListings,
      averageRating: parseFloat(averageRating),
      
      // Recent activity (last 7 days)
      recentActivity: {
        newListings: recentActivity[0],
        newFavorites: recentActivity[1],
        newMessages: recentActivity[2]
      },
      
      // User info
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isAgent: user.isAgent
      },
      
      // Status indicators
      status: {
        hasUnreadMessages: unreadMessages > 0,
        hasPendingListings: pendingListings > 0,
        isNearListingLimit: remainingListings <= 5,
        hasLowBalance: (pointBalance?.balance || 0) < 100
      }
    };

    console.log('Dashboard Stats Response:', {
      userId,
      totalListings,
      pendingListings,
      approvedListings,
      totalFavorites,
      averageRating,
      unreadMessages,
      totalMessages,
      balance: pointBalance?.balance || 0
    });

    res.json({
      success: true,
      message: 'Dashboard statistics retrieved successfully',
      data: dashboardData,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Dashboard Stats Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve dashboard statistics',
      error: error.message
    });
  }
};

/**
 * Get detailed dashboard analytics with charts data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getDashboardAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;
    const { period = '30d' } = req.query; // 7d, 30d, 90d, 1y

    console.log('Dashboard Analytics Request:', {
      userId,
      period,
      timestamp: new Date().toISOString()
    });

    // Calculate date range based on period
    const now = new Date();
    let startDate = new Date();
    
    switch (period) {
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 30);
    }

    // Get analytics data
    const [
      listingsOverTime,
      favoritesOverTime,
      messagesOverTime,
      reviewsOverTime,
      topPerformingListings,
      monthlyStats
    ] = await Promise.all([
      // Listings created over time
      Listing.aggregate([
        {
          $match: {
            agentId: userId,
            createdAt: { $gte: startDate },
            isDeleted: { $ne: true }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
              day: { $dayOfMonth: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
      ]),

      // Favorites over time
      Favorite.aggregate([
        {
          $match: {
            userId: userId,
            createdAt: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
              day: { $dayOfMonth: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
      ]),

      // Messages over time
      Message.aggregate([
        {
          $match: {
            recipientId: userId,
            createdAt: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
              day: { $dayOfMonth: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
      ]),

      // Reviews over time
      Review.aggregate([
        {
          $match: {
            agentId: userId,
            createdAt: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
              day: { $dayOfMonth: '$createdAt' }
            },
            count: { $sum: 1 },
            avgRating: { $avg: '$rating' }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
      ]),

      // Top performing listings (by visits)
      Listing.find({
        agentId: userId,
        isDeleted: { $ne: true }
      })
      .select('propertyTitle propertyPrice visitCount createdAt')
      .sort({ visitCount: -1 })
      .limit(5),

      // Monthly statistics
      Listing.aggregate([
        {
          $match: {
            agentId: userId,
            createdAt: { $gte: startDate },
            isDeleted: { $ne: true }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            totalListings: { $sum: 1 },
            totalVisits: { $sum: '$visitCount' },
            avgPrice: { $avg: '$propertyPrice' }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
      ])
    ]);

    // Format data for charts
    const formatChartData = (data, label) => {
      return data.map(item => ({
        date: `${item._id.year}-${String(item._id.month).padStart(2, '0')}-${String(item._id.day).padStart(2, '0')}`,
        value: item.count || item.avgRating || 0,
        label: label
      }));
    };

    const analyticsData = {
      period,
      dateRange: {
        start: startDate.toISOString(),
        end: now.toISOString()
      },
      
      // Chart data
      charts: {
        listingsOverTime: formatChartData(listingsOverTime, 'Listings'),
        favoritesOverTime: formatChartData(favoritesOverTime, 'Favorites'),
        messagesOverTime: formatChartData(messagesOverTime, 'Messages'),
        reviewsOverTime: formatChartData(reviewsOverTime, 'Reviews')
      },
      
      // Top performing listings
      topPerformingListings: topPerformingListings.map(listing => ({
        id: listing._id,
        title: listing.propertyTitle || 'Untitled Property',
        price: listing.propertyPrice || 0,
        visits: listing.visitCount || 0,
        createdAt: listing.createdAt
      })),
      
      // Monthly statistics
      monthlyStats: monthlyStats.map(stat => ({
        month: `${stat._id.year}-${String(stat._id.month).padStart(2, '0')}`,
        totalListings: stat.totalListings,
        totalVisits: stat.totalVisits,
        avgPrice: Math.round(stat.avgPrice || 0)
      })),
      
      // Summary
      summary: {
        totalDataPoints: listingsOverTime.length + favoritesOverTime.length + messagesOverTime.length + reviewsOverTime.length,
        periodDays: Math.ceil((now - startDate) / (1000 * 60 * 60 * 24)),
        dataCompleteness: '100%' // Could be calculated based on expected vs actual data points
      }
    };

    console.log('Dashboard Analytics Response:', {
      userId,
      period,
      dataPoints: analyticsData.summary.totalDataPoints,
      topListings: topPerformingListings.length
    });

    res.json({
      success: true,
      message: 'Dashboard analytics retrieved successfully',
      data: analyticsData,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Dashboard Analytics Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve dashboard analytics',
      error: error.message
    });
  }
};

/**
 * Get dashboard notifications and alerts
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getDashboardNotifications = async (req, res) => {
  try {
    const userId = req.user.id;

    console.log('Dashboard Notifications Request:', {
      userId,
      timestamp: new Date().toISOString()
    });

    // Get various notifications
    const [
      unreadMessages,
      pendingListings,
      lowBalance,
      expiringListings,
      newReviews
    ] = await Promise.all([
      // Unread messages
      Message.find({
        recipientId: userId,
        isRead: false
      }).select('senderId subject createdAt').limit(5),

      // Pending listings
      Listing.find({
        agentId: userId,
        approvalStatus: 'pending',
        isDeleted: { $ne: true }
      }).select('propertyTitle createdAt').limit(5),

      // Low balance check
      Point.findOne({ userId: userId }).select('balance'),

      // Expiring listings (older than 90 days)
      Listing.find({
        agentId: userId,
        createdAt: { $lte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) },
        isDeleted: { $ne: true }
      }).select('propertyTitle createdAt').limit(5),

      // Recent reviews
      Review.find({
        agentId: userId
      }).select('rating comment createdAt').sort({ createdAt: -1 }).limit(5)
    ]);

    const notifications = [];

    // Add notifications based on conditions
    if (unreadMessages.length > 0) {
      notifications.push({
        type: 'message',
        priority: 'high',
        title: `${unreadMessages.length} unread message${unreadMessages.length > 1 ? 's' : ''}`,
        message: `You have ${unreadMessages.length} unread message${unreadMessages.length > 1 ? 's' : ''}`,
        count: unreadMessages.length,
        data: unreadMessages
      });
    }

    if (pendingListings.length > 0) {
      notifications.push({
        type: 'listing',
        priority: 'medium',
        title: `${pendingListings.length} pending listing${pendingListings.length > 1 ? 's' : ''}`,
        message: `You have ${pendingListings.length} listing${pendingListings.length > 1 ? 's' : ''} awaiting approval`,
        count: pendingListings.length,
        data: pendingListings
      });
    }

    if (lowBalance && lowBalance.balance < 100) {
      notifications.push({
        type: 'balance',
        priority: 'high',
        title: 'Low balance warning',
        message: `Your balance is $${lowBalance.balance}. Consider adding more points.`,
        count: 1,
        data: { balance: lowBalance.balance }
      });
    }

    if (expiringListings.length > 0) {
      notifications.push({
        type: 'expiring',
        priority: 'low',
        title: `${expiringListings.length} listing${expiringListings.length > 1 ? 's' : ''} may need renewal`,
        message: `Consider renewing or updating your older listings`,
        count: expiringListings.length,
        data: expiringListings
      });
    }

    if (newReviews.length > 0) {
      notifications.push({
        type: 'review',
        priority: 'medium',
        title: `${newReviews.length} recent review${newReviews.length > 1 ? 's' : ''}`,
        message: `You have received ${newReviews.length} new review${newReviews.length > 1 ? 's' : ''}`,
        count: newReviews.length,
        data: newReviews
      });
    }

    console.log('Dashboard Notifications Response:', {
      userId,
      notificationCount: notifications.length,
      types: notifications.map(n => n.type)
    });

    res.json({
      success: true,
      message: 'Dashboard notifications retrieved successfully',
      data: {
        notifications,
        totalCount: notifications.length,
        unreadCount: notifications.filter(n => n.priority === 'high').length
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Dashboard Notifications Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve dashboard notifications',
      error: error.message
    });
  }
};

module.exports = {
  getDashboardStats,
  getDashboardAnalytics,
  getDashboardNotifications
};
