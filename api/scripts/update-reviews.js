require('dotenv').config();
const mongoose = require('mongoose');

async function updateReviews() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://safi:35064612@cluster0-ags3s.mongodb.net/SyProperties?retryWrites=true&w=majority');
    
    const db = mongoose.connection.db;
    const Review = db.collection('reviews');
    const Listing = db.collection('listings');
    
    console.log('Getting all reviews...\n');
    
    const reviews = await Review.find({}).toArray();
    console.log(`Found ${reviews.length} reviews\n`);
    
    let updated = 0;
    
    for (const review of reviews) {
      if (!review.agentId && review.propertyId) {
        try {
          const listing = await Listing.findOne({ _id: review.propertyId });
          
          if (listing && listing.agentId) {
            await Review.updateOne(
              { _id: review._id },
              { $set: { agentId: listing.agentId } }
            );
            console.log(`✅ Updated review ${review._id.toString().substring(0, 8)}... with agentId ${listing.agentId.toString().substring(0, 8)}...`);
            updated++;
          }
        } catch (err) {
          console.log(`⚠️  Skipping review: ${err.message}`);
        }
      }
    }
    
    console.log(`\n✅ Total updated: ${updated} reviews`);
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

updateReviews();
