const mongoose = require('mongoose');
const Agent = require('./models/agent.model');

mongoose.connect('mongodb://localhost:27017/syProperty')
  .then(async () => {
    console.log('✅ MongoDB Connected');
    
    const agents = await Agent.find({});
    console.log('Total agents in database:', agents.length);
    
    agents.forEach((agent, index) => {
      console.log(`${index + 1}. ${agent.fullName} (${agent._id})`);
    });
    
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
  });
