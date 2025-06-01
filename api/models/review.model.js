const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    propertyId: {
        type: String,
        ref: 'Property',
        required: true,
        index: true,
      },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    review: {
      type: String,
      required: true,
      trim: true,
    },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
  },
  { timestamps: true }

);

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;

