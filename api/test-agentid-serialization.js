const mongoose = require('mongoose');
const Listing = require('./models/listing.model');

mongoose.connect('mongodb://localhost:27017/syProperty')
  .then(async () => {
    console.log('✅ MongoDB Connected');
    
    // Get first listing
    const listing = await Listing.findOne();
    console.log('Raw listing from DB:');
    console.log('agentId type:', typeof listing.agentId);
    console.log('agentId value:', listing.agentId);
    console.log('agentId toString:', listing.agentId ? listing.agentId.toString() : 'null');
    
    // Convert to JSON
    const jsonListing = listing.toJSON();
    console.log('\nJSON listing:');
    console.log('agentId type:', typeof jsonListing.agentId);
    console.log('agentId value:', jsonListing.agentId);
    
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
  });
