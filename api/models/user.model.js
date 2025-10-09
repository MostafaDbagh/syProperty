const  mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['user', 'agent'],
      default: 'user',
      required: true,
    },
    avatar:{
      type: String,
      default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
    },
    // Profile information
    description: {
      type: String,
      default: '',
    },
    company: {
      type: String,
      default: '',
    },
    position: {
      type: String,
      default: '',
    },
    officeNumber: {
      type: String,
      default: '',
    },
    officeAddress: {
      type: String,
      default: '',
    },
    job: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      default: '',
    },
    // Social media links
    facebook: {
      type: String,
      default: '',
    },
    twitter: {
      type: String,
      default: '',
    },
    linkedin: {
      type: String,
      default: '',
    },
    // Agent-specific fields
    posterImage: {
      type: String,
      default: '',
    },
    // Point system fields
    pointsBalance: {
      type: Number,
      default: 0,
      min: 0,
    },
    packageType: {
      type: String,
      enum: ['basic', 'premium', 'enterprise'],
      default: 'basic',
    },
    packageExpiry: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
