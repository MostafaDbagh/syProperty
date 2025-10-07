const User = require('../models/user.model.js');
const bcryptjs = require('bcryptjs');
const errorHandler = require('../utils/error.js');
const jwt = require('jsonwebtoken');

const signup = async (req, res, next) => {
  const { username, email, password, role } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashedPassword, role });
  try {
    await newUser.save();
    res.status(201).json({
      success: true,
      message: 'User created successfully!',
      user: newUser
    });
  } catch (error) {
    // Handle duplicate key errors specifically
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      const value = error.keyValue[field];
      return res.status(400).json({
        success: false,
        message: `${field} '${value}' already exists. Please use a different ${field}.`,
        error: 'DUPLICATE_KEY_ERROR'
      });
    }
    // Handle other validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors,
        error: 'VALIDATION_ERROR'
      });
    }
    // Handle other errors
    next(error);
  }
};

const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, 'User not found!'));
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, 'Wrong credentials!'));
    const token = jwt.sign({ id: validUser._id }, '5345jkj5kl34j5kl34j5');
    const { password: pass, ...rest } = validUser._doc;
    res
      .cookie('access_token', token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = user._doc;
      res
        .cookie('access_token', token, { httpOnly: true })
        .status(200)
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        username:
          req.body.name.split(' ').join('').toLowerCase() +
          Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = newUser._doc;
      res
        .cookie('access_token', token, { httpOnly: true })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

const signOut = async (req, res, next) => {
  try {
    res.clearCookie('access_token');
    res.status(200).json('User has been logged out!');
  } catch (error) {
    next(error);
  }
};

// OTP Functions
const sendOTP = async (req, res, next) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
        error: 'MISSING_EMAIL'
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // In a real application, you would send this OTP via email/SMS
    // For now, we'll just log it and return success
    console.log(`OTP for ${email}: ${otp}`);
    
    // Store OTP in memory (in production, use Redis or database)
    if (!global.otpStore) {
      global.otpStore = new Map();
    }
    global.otpStore.set(email, {
      otp: otp,
      timestamp: Date.now(),
      attempts: 0
    });

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      // For testing purposes, include OTP in response
      otp: otp
    });
  } catch (error) {
    next(error);
  }
};

const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required',
        error: 'MISSING_PARAMETERS'
      });
    }

    // Check if OTP exists in store
    if (!global.otpStore || !global.otpStore.has(email)) {
      return res.status(400).json({
        success: false,
        message: 'OTP not found or expired',
        error: 'OTP_NOT_FOUND'
      });
    }

    const otpData = global.otpStore.get(email);
    
    // Check if OTP is expired (5 minutes)
    const now = Date.now();
    const otpAge = now - otpData.timestamp;
    if (otpAge > 5 * 60 * 1000) { // 5 minutes
      global.otpStore.delete(email);
      return res.status(400).json({
        success: false,
        message: 'OTP has expired',
        error: 'OTP_EXPIRED'
      });
    }

    // Check attempts (max 3 attempts)
    if (otpData.attempts >= 3) {
      global.otpStore.delete(email);
      return res.status(400).json({
        success: false,
        message: 'Too many attempts. Please request a new OTP',
        error: 'TOO_MANY_ATTEMPTS'
      });
    }

    // Verify OTP
    if (otpData.otp !== otp) {
      otpData.attempts++;
      global.otpStore.set(email, otpData);
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP',
        error: 'INVALID_OTP'
      });
    }

    // OTP is valid, remove it from store
    global.otpStore.delete(email);

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  signin,
  google,
  signOut,
  sendOTP,
  verifyOTP,
};
