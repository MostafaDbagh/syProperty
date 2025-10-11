const express = require('express');
const router = express.Router();
const {
  addFavorite,
  removeFavorite,
  getFavorites,
  isFavorited
} = require('../controllers/favorite.controller');

const verifyToken = require('../utils/verifyUser')

router.post('/', verifyToken, addFavorite);
router.delete('/:propertyId', verifyToken, removeFavorite);
router.get('/', verifyToken, getFavorites);
router.get('/check/:propertyId', verifyToken, isFavorited);

module.exports = router;
