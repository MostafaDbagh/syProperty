const express = require('express');
const router = express.Router();
const ListingController = require('../controllers/listing.controller.js');
const verifyToken = require('../utils/verifyUser.js');
const filterListings = require('../middleware/listing.js');
const {uploadListingImages,uploadListingImagesMiddleware} = require('../utils/uploadListingImages.js');
const { 
  checkAndDeductPoints, 
  deductPointsAfterListing, 
  refundPointsOnListingDelete 
} = require('../middleware/pointDeduction.js');

router.get('/search', filterListings, ListingController.getFilteredListings);
router.post('/create', verifyToken, checkAndDeductPoints, uploadListingImages, uploadListingImagesMiddleware, ListingController.createListing, deductPointsAfterListing);
router.get('/stateCount',ListingController.getEachStateListing)

// router.post('/create',   uploadListingImages, uploadListingImagesMiddleware, ListingController.createListing);
router.delete('/delete/:id', verifyToken, refundPointsOnListingDelete, ListingController.deleteListing);
router.post('/update/:id', verifyToken, ListingController.updateListing);
router.get('/:id', ListingController.getListingById);
router.get('/:id/images', ListingController.getListingImages);
router.get('/agent/:agentId', verifyToken, ListingController.getListingsByAgent);


module.exports = router;
