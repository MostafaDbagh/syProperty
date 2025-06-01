const express = require('express');
const router = express.Router();
const ListingController = require('../controllers/listing.controller.js');
const verifyToken = require('../utils/verifyUser.js');
const filterListings = require('../middleware/listing.js');

router.get('/search', filterListings, ListingController.getFilteredListings);
router.post('/add', ListingController.createListing);
router.delete('/delete/:id', verifyToken, ListingController.deleteListing);
router.post('/update/:id', verifyToken, ListingController.updateListing);
router.get('/:id', ListingController.getListingById);
router.get('/', ListingController.getListings);
router.get('/agent/:agentId', ListingController.getListingsByAgent);


module.exports = router;
