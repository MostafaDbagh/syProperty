// routes/auth.route.js
const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');

router.post('/signup', AuthController.signup);
router.post('/signin', AuthController.signin);
router.post('/google', AuthController.google);
router.get('/signout', AuthController.signOut);

module.exports = router;
