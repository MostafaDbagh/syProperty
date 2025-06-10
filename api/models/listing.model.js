const  mongoose = require('mongoose');
const listingSchema = new mongoose.Schema(
  {
    propertyId: { type: String, unique: true },       
    name: { type: String, required: true },
       imageNames: { type: [String], required: true },
    description: { type: String, required: true },
    address: { type: String, required: true },
    country: { type: String },
    state: { type: String },
    neighborhood: { type: String },
    price: { type: Number, required: true },
    type: { type: String, required: true, enum: ['For Sale', 'For Rent'] },           
    rentType: {
      type: String,
      enum: ['monthly', 'yearly', 'weekly'],
      required: function () {
        return this.type === 'rent';
      }
    },
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
    images: [
      {
        publicId: { type: String, required: true },
        url: { type: String, required: true },
      }
    ],
        videoUrl: { type: String },                      
        offer: { type: Boolean, required: false },
        agent: { type: String, required: true },
        isSold: { type: Boolean, default: false },
        isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);



const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;
