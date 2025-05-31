// routes/user.route.js
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const verifyToken = require('../utils/verifyUser');

router.get('/test', UserController.test);
router.post('/update/:id', verifyToken, UserController.updateUser);
router.delete('/delete/:id', verifyToken, UserController.deleteUser);
router.get('/listings/:id', verifyToken, UserController.getUserListings);
router.get('/:id', verifyToken, UserController.getUser);

module.exports = router;
