const express = require('express');
const router = express.Router();
const {
  addFavorite,
  removeFavorite,
  getFavorites
} = require('../controllers/favorite.controller');

const verifyToken = require('../utils/verifyUser')

router.post('/', verifyToken, addFavorite);
router.delete('/:propertyId', verifyToken, removeFavorite);
router.get('/', verifyToken, getFavorites);

module.exports = router;
