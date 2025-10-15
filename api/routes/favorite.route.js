const express = require('express');
const router = express.Router();
const {
  addFavorite,
  removeFavorite,
  getFavorites,
  isFavorited
} = require('../controllers/favorite.controller');

router.post('/', addFavorite);
router.delete('/:propertyId', removeFavorite);
router.get('/', getFavorites);
router.get('/check/:propertyId', isFavorited);

module.exports = router;
