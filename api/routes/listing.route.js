const express = require('express');
const router = express.Router();
const ListingController = require('../controllers/listing.controller.js');
const filterListings = require('../middleware/listing.js');
const {uploadListingImages,uploadListingImagesMiddleware} = require('../utils/uploadListingImages.js');
const { 
  checkAndDeductPoints, 
  deductPointsAfterListing, 
  refundPointsOnListingDelete 
} = require('../middleware/pointDeduction.js');

router.get('/search', filterListings, ListingController.getFilteredListings);
router.post('/create', uploadListingImages, uploadListingImagesMiddleware, checkAndDeductPoints, ListingController.createListing, deductPointsAfterListing);
router.get('/stateCount',ListingController.getEachStateListing);
router.delete('/delete/:id', refundPointsOnListingDelete, ListingController.deleteListing);
router.post('/update/:id', ListingController.updateListing);
router.get('/:id', ListingController.getListingById);
router.get('/:id/images', ListingController.getListingImages);
router.get('/agent/:agentId', ListingController.getListingsByAgent);
router.post('/:id/visit', ListingController.incrementVisitCount);
router.get('/agent/:agentId/mostVisited', ListingController.getMostVisitedListings);

module.exports = router;
