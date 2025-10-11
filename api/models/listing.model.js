const  mongoose = require('mongoose');
const listingSchema = new mongoose.Schema(
  {
    propertyId: { type: String, unique: true },  
    propertyType: { type: String, required: true },           
    propertyKeyword: { type: String, required: true },
    propertyDesc: { type: String, required: true },
    description: { type: String }, // Alternative field name
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
    squareFootage: { type: Number }, // Alternative field name                      
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

    agent: { type: String, required: true }, // Legacy field - keep for backward compatibility
    agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }, // New field for proper reference
    agentEmail: { type: String, required: false },
    agentNumber: { type: String, required: false },
    agentWhatsapp: { type: String, required: false },
    approvalStatus: { 
      type: String, 
      enum: ['pending', 'approved', 'rejected', 'closed'], 
      default: 'pending' 
    },
    isSold: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    offer: { type: Boolean, required: false },
    visitCount: { type: Number, default: 0 },

    ////media -part
    videoUrl: { type: String },                      
    imageNames: { 
      type: [String], 
      required: false,
      default: [],
      maxlength: 7 // Maximum 7 images as per requirement
    },         
    images: [
      {
        publicId: { type: String, required: false },
        url: { type: String, required: false },
        filename: { type: String, required: false }, // Store original filename
        uploadedAt: { type: Date, default: Date.now }
      }
    ],
     
      
  },
  { timestamps: true }
);



const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;
