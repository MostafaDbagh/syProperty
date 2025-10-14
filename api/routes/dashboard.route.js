const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getDashboardAnalytics
} = require('../controllers/dashboard.controller');
const verifyToken = require('../utils/verifyUser');

// All routes require authentication
router.use(verifyToken);

// Get dashboard statistics
router.get('/stats', getDashboardStats);

// Get dashboard analytics
router.get('/analytics', getDashboardAnalytics);

module.exports = router;

