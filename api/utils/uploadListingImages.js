const multer = require('multer');
const cloudinary = require('../utils/cloudinary');

// Multer config — memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Cloudinary upload helper
function uploadToCloudinary(buffer, folder) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(buffer);
  });
}

// Middleware to handle multiple listing images upload
async function uploadListingImagesMiddleware(req, res, next) {
  try {
    if (!req.files) return next();

    const uploadedImages = [];

    for (const file of req.files) {
      const result = await uploadToCloudinary(file.buffer, 'listings');
      uploadedImages.push({
        publicId: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.images = uploadedImages;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  uploadListingImages: upload.array('images', 7),
  uploadListingImagesMiddleware,
};
