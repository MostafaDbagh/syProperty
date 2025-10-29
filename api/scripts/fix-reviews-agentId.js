require('dotenv').config();
const mongoose = require('mongoose');

async function fixReviewsAgentId() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://safi:35064612@cluster0-ags3s.mongodb.net/SyProperties?retryWrites=true&w=majority');
    
    const db = mongoose.connection.db;
    const Review = db.collection('reviews');
    const Listing = db.collection('listings');
    
    console.log('Updating reviews with agentId...\n');
    
    // Get all reviews
    const reviews = await Review.find({}).toArray();
    
    console.log(`Found ${reviews.length} reviews to process\n`);
    
    let updated = 0;
    
    for (const review of reviews) {
      if (!review.agentId && review.propertyId) {
        try {
          // Find the listing to get its agentId
          const listing = await Listing.findOne({ _id: review.propertyId });
          
          if (listing && listing.agentId) {
            await Review.updateOne(
              { _id: review._id },
              { $set: { agentId: listing.agentId } }
            );
            updated++;
            console.log(`Updated review ${review._id}`);
          }
        } catch (err) {
          console.log(`Skipping review ${review._id}: ${err.message}`);
        }
      }
    }
    
    console.log(`\n✅ Updated ${updated} reviews with agentId`);
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

fixReviewsAgentId();
