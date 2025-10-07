const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');

router.post('/signup', AuthController.signup);
router.post('/signin', AuthController.signin);
router.post('/google', AuthController.google);
router.get('/signout', AuthController.signOut);
router.post('/send-otp', AuthController.sendOTP);
router.post('/verify-otp', AuthController.verifyOTP);

module.exports = router;
