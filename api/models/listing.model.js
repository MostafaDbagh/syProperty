const  mongoose = require('mongoose');

const listingSchema = new mongoose.Schema(
  {
    propertyId: { type: String, unique: true },       
    name: { type: String, required: true },
    description: { type: String, required: true },
    address: { type: String, required: true },
    country: { type: String },
    state: { type: String },
    neighborhood: { type: String },
    price: { type: Number, required: true },
    type: { type: String, required: true },           
    status: { type: String },                         
    label: { type: String },                          
    bedrooms: { type: Number, required: true },
    bathrooms: { type: Number, required: true },
    size: { type: Number },                      
    landArea: { type: Number },                       
    furnished: { type: Boolean, required: true },
    garages: { type: Boolean, required: true },
    garageSize: { type: Number },
    yearBuilt: { type: Number },
    amenities: [{ type: String }],                  
    imageUrls: { type: [String], required: true },
    videoUrl: { type: String },                      
    offer: { type: Boolean, required: false },
  },
  { timestamps: true }
);

const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;
