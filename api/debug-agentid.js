const mongoose = require('mongoose');
const Agent = require('./models/agent.model');
const Listing = require('./models/listing.model');

mongoose.connect('mongodb://localhost:27017/syProperty')
  .then(async () => {
    console.log('✅ MongoDB Connected');
    
    // Get first agent
    const agent = await Agent.findOne();
    console.log('Agent found:', agent ? agent.fullName : 'No agent found');
    console.log('Agent ID:', agent ? agent._id : 'No ID');
    
    // Get first listing
    const listing = await Listing.findOne();
    console.log('Listing found:', listing ? listing.agent : 'No listing found');
    console.log('Listing agentId:', listing ? listing.agentId : 'No agentId');
    
    // Check if agentId is being set properly
    if (agent && listing) {
      console.log('Setting agentId manually...');
      listing.agentId = agent._id;
      await listing.save();
      console.log('Updated listing agentId:', listing.agentId);
    }
    
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
  });
