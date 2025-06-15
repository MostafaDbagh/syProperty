const  mongoose = require('mongoose');
const listingSchema = new mongoose.Schema(
  {
    propertyId: { type: String, unique: true },  
    propertyType: { type: String, required: true },           
    propertyKeyword: { type: String, required: true },
    propertyDesc: { type: String, required: true },
    propertyPrice: { type: Number, required: true },
    status: { type: String, required: true, enum: ['sale', 'rent'] },   
    rentType: {
      type: String,
      enum: ['monthly', 'yearly', 'weekly'],
      required: function () {
        return this.type === 'rent';
      }
    },
//////property specification//////
    bedrooms: { type: Number, required: true },
    bathrooms: { type: Number, required: true },
    size: { type: Number,required:true },                      
    landArea: { type: Number },                       
    furnished: { type: Boolean, required: true },
    garages: { type: Boolean, required: true },
    garageSize: { type: Number },
    yearBuilt: { type: Number },
    amenities: [{ type: String }],  
//////property location//////////
    address: { type: String, required: true },
    country: { type: String,required:true  },
    state: { type: String,required:true  },
    neighborhood: { type: String,required:true },

    agent: { type: String, required: true },
    isSold: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    offer: { type: Boolean, required: false },

    ////media -part
    videoUrl: { type: String },                      
    imageNames: { type: [String], required: false },         
    images: [
      {
        publicId: { type: String, required: false },
        url: { type: String, required: false },
      }
    ],
     
      
  },
  { timestamps: true }
);



const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;
