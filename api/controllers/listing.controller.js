const Listing = require('../models/listing.model.js');
const { errorHandler } = require('../utils/error.js');
const cloudinary = require('../utils/cloudinary.js')





const createListing = async (req, res, next) => {
  try {
    const listingData = {
      ...req.body,
      // Ensure images and imageNames are properly set
      images: req.body.images || [],
      imageNames: req.body.imageNames || [],
      // Set agentId from req.body if provided (should be user's _id)
      agentId: req.body.agentId || req.body.userId || null
    };

    const newListing = await Listing.create(listingData);
    
    // Store listing ID for point deduction middleware
    req.listingId = newListing._id;
    res.locals.listingId = newListing._id;

    // Prepare response with points info if available
    const response = {
      ...newListing.toObject(),
      pointsInfo: res.locals.pointsDeducted || null
    };

    res.status(201).json(response);
  }
     catch (error) {
    next(error);
  }
};

const deleteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return next(errorHandler(404, 'Listing not found!'));
    }

    // Check if user is authenticated
    if (!req.user) {
      return next(errorHandler(401, 'You must be logged in to delete listings!'));
    }

    // Get user ID from req.user (could be req.user.id or req.user._id)
    const userId = req.user.id || req.user._id?.toString();

    // Check authorization - support both old and new agent systems
    // Compare with string representations to ensure proper matching
    const listingUserRef = listing.userRef?.toString();
    const listingAgentId = listing.agentId?.toString();
    
    const isAuthorized = 
      (listingUserRef && userId === listingUserRef) || // Old system
      (listingAgentId && userId === listingAgentId); // New system

    if (!isAuthorized) {
      console.log('Authorization failed for delete:', {
        userId,
        listingUserRef,
        listingAgentId,
        reqUser: req.user
      });
      return next(errorHandler(401, 'You can only delete your own listings!'));
    }

    await Listing.findByIdAndDelete(req.params.id);
    
    // Prepare response with refund info if available
    const response = {
      message: 'Listing has been deleted!',
      pointsRefunded: res.locals.pointsRefunded || null
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

const updateListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, 'Listing not found!'));
    }

    // Check if user is authenticated
    if (!req.user) {
      return next(errorHandler(401, 'You must be logged in to update listings!'));
    }

    // Get user ID from req.user (could be req.user.id or req.user._id)
    const userId = req.user.id || req.user._id?.toString();

    // Check authorization - support both old and new agent systems
    // Compare with string representations to ensure proper matching
    const listingUserRef = listing.userRef?.toString();
    const listingAgentId = listing.agentId?.toString();
    
    const isAuthorized = 
      (listingUserRef && userId === listingUserRef) || // Old system
      (listingAgentId && userId === listingAgentId); // New system

    if (!isAuthorized) {
      console.log('Authorization failed:', {
        userId,
        listingUserRef,
        listingAgentId,
        reqUser: req.user
      });
      return next(errorHandler(401, 'You can only update your own listings!'));
    }

    // Remove fields that shouldn't be updated directly
    const updateData = { ...req.body };
    delete updateData._id;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      updateData,
      { 
        new: true, 
        runValidators: true 
      }
    ).populate('agentId', 'firstName lastName email phone');

    res.status(200).json({
      success: true,
      message: 'Listing updated successfully',
      data: updatedListing
    });
  } catch (error) {
    next(error);
  }
};

const getListingById = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, 'Listing not found!'));
    }
    
    // Return listing with image information
    const response = {
      ...listing.toObject(),
      imageCount: listing.images ? listing.images.length : 0,
      hasImages: listing.images && listing.images.length > 0
    };
    
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// Get listing images specifically
const getListingImages = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, 'Listing not found!'));
    }

    const imageData = {
      imageNames: listing.imageNames || [],
      images: listing.images || [],
      imageCount: listing.images ? listing.images.length : 0,
      hasImages: listing.images && listing.images.length > 0
    };

    res.status(200).json({
      success: true,
      data: imageData
    });
  } catch (error) {
    next(error);
  }
};

const getFilteredListings = async (req, res) => {
  try {
    const filter = req.filter || {};
    const sortOptions = req.sortOptions || { createdAt: -1 };
    
    // Add filter to exclude deleted listings
    filter.isDeleted = { $ne: true };
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12; // Default to 12 items per page
    const skip = (page - 1) * limit;

    const listings = await Listing.find(filter)
      .skip(skip)
      .limit(limit)
      .sort(sortOptions); // Use dynamic sort options

    const total = await Listing.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    console.log('API Debug:', {
      filter,
      total,
      page,
      limit,
      totalPages,
      listingsCount: listings.length
    });

    // Debug first listing structure
    if (listings.length > 0) {
      console.log('First listing structure:', {
        _id: listings[0]._id,
        propertyTitle: listings[0].propertyTitle,
        images: listings[0].images,
        imageNames: listings[0].imageNames,
        hasImages: listings[0].images && listings[0].images.length > 0,
        imageCount: listings[0].images ? listings[0].images.length : 0
      });
    }

    res.status(200).json({
      success: true,
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      data: listings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching filtered listings',
      error: error.message
    });
  }
};

const getListingsByAgent = async (req, res, next) => {
  try {
    const agentId = req.params.agentId;
    if (!agentId) {
      return next(errorHandler(400, 'Agent ID is required'));
    }

    // Get pagination and filter parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6; // Default to 6 items per page
    const skip = (page - 1) * limit;
    const status = req.query.status; // 'rent' or 'sale' filter

    // Build filter object
    let filter = { 
      $or: [
        { agent: agentId }, // Legacy field (string)
        { agentId: agentId } // New field (ObjectId)
      ],
      isDeleted: { $ne: true } // Exclude deleted listings
    };

    // Add status filter if provided
    if (status && status !== 'all') {
      filter.status = status;
    }

    // Get listings with pagination
    const listings = await Listing.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('agentId', 'username email avatar'); // Populate agent details if available

    // Get total count for pagination
    const total = await Listing.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      data: listings,
      pagination: {
        currentPage: page,
        totalPages,
        totalListings: total,
        limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    });
  } catch (error) {
    next(error);
  }
};


// Utility to get image data for a state
const getImageDataByState = (state) => {
  const commonDimensions = { width: 339, height: 245 };

  const map = {
    Damascus: {
      imageSrc: "/images/section/location-9.jpg",
      width: 689,
      height: 245,
    },
    Latakia: { imageSrc: "/images/section/location-10.jpg", ...commonDimensions },
    Aleppo: { imageSrc: "/images/section/location-11.jpg", ...commonDimensions },
    Homs: { imageSrc: "/images/section/location-12.jpg", ...commonDimensions },
    Hama: { imageSrc: "/images/section/location-13.jpg", ...commonDimensions },
    "Deir ez-zor": { imageSrc: "/images/section/location-14.jpg", ...commonDimensions },
    Tartus: { imageSrc: "/images/section/location-15.jpg", ...commonDimensions },
  };

  return map[state] || {
    imageSrc: "/images/default.jpg",
    width: 689,
    height: 467,
  };
};

const getEachStateListing = async (req, res) => {
  try {
    const listingsByState = await Listing.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: "$city", // Use 'city' field instead of 'state'
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    let formatted = listingsByState.map((item, index) => {
      const city = item._id;
      const { imageSrc, width, height } = getImageDataByState(city);

      return {
        id: index + 1,
        imageSrc,
        alt: "syProperties",
        width,
        height,
        state: city, // Keep 'state' key for backward compatibility with frontend
        city: city,
        properties: `${item.count.toLocaleString()} Properties`,
      };
    });

    const damascusIndex = formatted.findIndex(item => item.city === "Damascus");
    if (damascusIndex !== -1) {
      const [damascusItem] = formatted.splice(damascusIndex, 1);
      formatted.splice(formatted.length - 1, 0, damascusItem);
    }

    res.status(200).json({ success: true, data: formatted });
  } catch (error) {
    console.error("Error in getEachStateListing:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message || error,
    });
  }
};

const incrementVisitCount = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const listing = await Listing.findByIdAndUpdate(
      id,
      { $inc: { visitCount: 1 } },
      { new: true }
    );

    if (!listing) {
      return next(errorHandler(404, 'Listing not found!'));
    }

    res.status(200).json({
      success: true,
      visitCount: listing.visitCount
    });
  } catch (error) {
    next(error);
  }
};

const getMostVisitedListings = async (req, res, next) => {
  try {
    const { agentId } = req.params;
    const { limit = 10, page = 1 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = {
      agentId: agentId,
      isDeleted: { $ne: true },
      visitCount: { $gt: 0 } // Only listings with visits
    };

    const listings = await Listing.find(filter)
      .sort({ visitCount: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('agentId', 'username email fullName');

    const total = await Listing.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: listings,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
        hasNextPage: skip + parseInt(limit) < total,
        hasPrevPage: parseInt(page) > 1
      }
    });
  } catch (error) {
    next(error);
  }
};



module.exports = {
  createListing,
  deleteListing,
  updateListing,
  getListingById,
  getListingImages,
  getFilteredListings,
  getListingsByAgent,
  getEachStateListing,
  incrementVisitCount,
  getMostVisitedListings
};
