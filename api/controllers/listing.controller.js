const Listing = require('../models/listing.model.js');
const { errorHandler } = require('../utils/error.js');
const cloudinary = require('../utils/cloudinary.js')





const createListing = async (req, res, next) => {
  try {
    const listingData = {
      ...req.body,
      // Ensure images and imageNames are properly set
      images: req.body.images || [],
      imageNames: req.body.imageNames || []
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
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(errorHandler(404, 'Listing not found!'));
  }

  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, 'You can only delete your own listings!'));
  }

  try {
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
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(errorHandler(404, 'Listing not found!'));
  }
  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, 'You can only update your own listings!'));
  }

  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedListing);
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
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const listings = await Listing.find(filter).skip(skip).limit(limit);

    const total = await Listing.countDocuments(filter);

    res.status(200).json({
      success: true,
      total,
      page,
      limit,
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

    const listings = await Listing.find({ agent: agentId, isDeleted: false })
      .sort({ createdAt: -1 });

    res.status(200).json(listings);
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
          _id: "$state",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    let formatted = listingsByState.map((item, index) => {
      const state = item._id;
      const { imageSrc, width, height } = getImageDataByState(state);

      return {
        id: index + 1,
        imageSrc,
        alt: "syProperties",
        width,
        height,
        state,
        properties: `${item.count.toLocaleString()} Properties`,
      };
    });

    const damascusIndex = formatted.findIndex(item => item.state === "Damascus");
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



module.exports = {
  createListing,
  deleteListing,
  updateListing,
  getListingById,
  getListingImages,
  getFilteredListings,
  getListingsByAgent,
  getEachStateListing
};
