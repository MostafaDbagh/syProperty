require('dotenv').config();
const mongoose = require('mongoose');

async function fixOrphanedAgent() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://safi:35064612@cluster0-ags3s.mongodb.net/SyProperties?retryWrites=true&w=majority');
    
    const User = mongoose.connection.db.collection('users');
    const Listing = mongoose.connection.db.collection('listings');
    
    const orphanedAgentId = '68ff3cf7cbb96ae0f6c49528';
    
    console.log('Finding which agent this ID belonged to...\n');
    
    // Search through historical data or find by checking all listings
    // We need to find which agent name was originally assigned to this ID
    
    const allListings = await Listing.find({ isDeleted: { $ne: true } }).toArray();
    
    // The agent IDs we created earlier correspond to certain agent names
    // Let me check by looking at the pattern of agentIds
    
    console.log('Checking agent IDs and their associated names...\n');
    
    // Based on the script output from earlier, let me search for listings with specific patterns
    const agentMapping = {
      '68ff3cf6cbb96ae0f6c49512': 'Ahmad Al-Hassan',
      '68ff3cf6cbb96ae0f6c49515': 'Mohammad Ali',
      '68ff3cf6cbb96ae0f6c49518': 'Hassan Ibrahim',
      '68ff3cf6cbb96ae0f6c4951a': 'Omar Mahmoud',
      '68ff3cf6cbb96ae0f6c4951d': 'Khalil Abdullah',
      '68ff3cf7cbb96ae0f6c49520': 'Youssef Salim',
      '68ff3cf7cbb96ae0f6c49522': 'Ziad Malek',
      '68ff3cf7cbb96ae0f6c49524': 'Rami Nasser',
      '68ff3cf7cbb96ae0f6c49526': 'Bassam Hamdi',
      '68ff3cf7cbb96ae0f6c49528': 'Tarek Farouk'
    };
    
    const agentName = agentMapping[orphanedAgentId];
    
    if (agentName) {
      console.log(`This agent ID belongs to: ${agentName}\n`);
      
      // Check if we created this agent
      const existingUser = await User.findOne({ 
        $or: [
          { username: agentName.toLowerCase().replace(/\s+/g, '_') },
          { email: agentName.toLowerCase().replace(/\s+/g, '.') + '@syrianproperties.com' }
        ]
      });
      
      if (existingUser) {
        console.log(`✅ User account exists:`);
        console.log(`   Username: ${existingUser.username}`);
        console.log(`   Email: ${existingUser.email}`);
        console.log(`   User ID: ${existingUser._id}\n`);
        
        // Reassign listings
        const listings = await Listing.find({ 
          agent: agentName,
          isDeleted: { $ne: true }
        }).toArray();
        
        if (listings.length > 0) {
          const listingIds = listings.map(l => l._id);
          const updateResult = await Listing.updateMany(
            { _id: { $in: listingIds } },
            { $set: { agentId: existingUser._id } }
          );
          
          console.log(`✅ Reassigned ${updateResult.modifiedCount} listings to ${existingUser.username}`);
        }
      } else {
        console.log('❌ User account not found for this agent');
      }
    }
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

fixOrphanedAgent();
