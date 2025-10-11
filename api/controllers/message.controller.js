const Message = require('../models/message.model.js');
const Listing = require('../models/listing.model.js');
const mongoose = require('mongoose');
const errorHandler = require('../utils/error.js');

// Get messages for a specific agent with filtering and pagination
const getMessagesByAgent = async (req, res, next) => {
  try {
    const agentId = req.params.agentId;
    if (!agentId) {
      return next(errorHandler(400, 'Agent ID is required'));
    }

    // Get pagination and filter parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Filter parameters
    const status = req.query.status; // 'unread', 'read', 'replied', 'archived', 'all'
    const messageType = req.query.messageType; // 'inquiry', 'viewing_request', 'offer', 'question', 'complaint'
    const propertyId = req.query.propertyId;
    const search = req.query.search; // Search in sender name, email, subject, or message

    // Build filter object
    let filter = { 
      agentId: agentId
    };

    // Add status filter
    if (status && status !== 'all') {
      filter.status = status;
    }

    // Add message type filter
    if (messageType && messageType !== 'all') {
      filter.messageType = messageType;
    }

    // Add property filter
    if (propertyId && propertyId !== 'all') {
      filter.propertyId = propertyId;
    }

    // Add search filter
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { senderName: searchRegex },
        { senderEmail: searchRegex },
        { subject: searchRegex },
        { message: searchRegex }
      ];
    }

    // Get messages with pagination and populate property details
    const messages = await Message.find(filter)
      .populate('propertyId', 'propertyKeyword propertyPrice status propertyType images address')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await Message.countDocuments(filter);

    // Get statistics
    const stats = await Message.aggregate([
      { $match: { agentId: new mongoose.Types.ObjectId(agentId) } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get agent's properties for filter dropdown
    const agentProperties = await Listing.find({ 
      $or: [
        { agent: agentId },
        { agentId: agentId }
      ],
      isDeleted: { $ne: true }
    }).select('_id propertyKeyword propertyPrice status propertyType').limit(50);

    // Format statistics
    const statusStats = {
      total: total,
      unread: 0,
      read: 0,
      replied: 0,
      archived: 0
    };

    stats.forEach(stat => {
      statusStats[stat._id] = stat.count;
    });

    res.status(200).json({
      success: true,
      data: messages,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalMessages: total,
        limit,
        hasNextPage: page < Math.ceil(total / limit),
        hasPreviousPage: page > 1
      },
      stats: statusStats,
      filterOptions: {
        properties: agentProperties
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get a single message by ID
const getMessageById = async (req, res, next) => {
  try {
    const messageId = req.params.messageId;
    const message = await Message.findById(messageId)
      .populate('propertyId', 'propertyKeyword propertyPrice status propertyType images address')
      .populate('agentId', 'username email fullName');

    if (!message) {
      return next(errorHandler(404, 'Message not found'));
    }

    res.status(200).json({
      success: true,
      data: message
    });
  } catch (error) {
    next(error);
  }
};

// Mark message as read
const markAsRead = async (req, res, next) => {
  try {
    const messageId = req.params.messageId;
    const message = await Message.findByIdAndUpdate(
      messageId,
      { 
        status: 'read',
        readAt: new Date()
      },
      { new: true }
    );

    if (!message) {
      return next(errorHandler(404, 'Message not found'));
    }

    res.status(200).json({
      success: true,
      data: message
    });
  } catch (error) {
    next(error);
  }
};

// Reply to a message
const replyToMessage = async (req, res, next) => {
  try {
    const messageId = req.params.messageId;
    const { response } = req.body;

    if (!response || response.trim() === '') {
      return next(errorHandler(400, 'Response is required'));
    }

    const message = await Message.findByIdAndUpdate(
      messageId,
      { 
        response: response.trim(),
        status: 'replied',
        respondedAt: new Date()
      },
      { new: true }
    ).populate('propertyId', 'propertyKeyword propertyPrice status propertyType');

    if (!message) {
      return next(errorHandler(404, 'Message not found'));
    }

    res.status(200).json({
      success: true,
      data: message
    });
  } catch (error) {
    next(error);
  }
};

// Archive a message
const archiveMessage = async (req, res, next) => {
  try {
    const messageId = req.params.messageId;
    const message = await Message.findByIdAndUpdate(
      messageId,
      { 
        status: 'archived',
        archivedAt: new Date()
      },
      { new: true }
    );

    if (!message) {
      return next(errorHandler(404, 'Message not found'));
    }

    res.status(200).json({
      success: true,
      data: message
    });
  } catch (error) {
    next(error);
  }
};

// Create a new message (for contact forms)
const createMessage = async (req, res, next) => {
  try {
    const {
      propertyId,
      agentId,
      senderName,
      senderEmail,
      senderPhone,
      subject,
      message,
      messageType = 'inquiry'
    } = req.body;

    // Validation
    if (!propertyId || !agentId || !senderName || !senderEmail || !subject || !message) {
      return next(errorHandler(400, 'All required fields must be provided'));
    }

    // Create new message
    const newMessage = new Message({
      propertyId,
      agentId,
      senderName,
      senderEmail,
      senderPhone,
      subject,
      message,
      messageType,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    await newMessage.save();

    // Populate property details for response
    await newMessage.populate('propertyId', 'propertyKeyword propertyPrice status propertyType');

    res.status(201).json({
      success: true,
      data: newMessage
    });
  } catch (error) {
    next(error);
  }
};

// Delete a message
const deleteMessage = async (req, res, next) => {
  try {
    const messageId = req.params.messageId;
    const message = await Message.findByIdAndDelete(messageId);

    if (!message) {
      return next(errorHandler(404, 'Message not found'));
    }

    res.status(200).json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMessagesByAgent,
  getMessageById,
  markAsRead,
  replyToMessage,
  archiveMessage,
  createMessage,
  deleteMessage
};
