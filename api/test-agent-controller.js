const mongoose = require('mongoose');
const Agent = require('./models/agent.model');

mongoose.connect('mongodb://localhost:27017/syProperty')
  .then(async () => {
    console.log('✅ MongoDB Connected');
    
    // Test the same query as the controller
    const agents = await Agent.find();
    console.log('Agents found by Agent.find():', agents.length);
    
    agents.forEach((agent, index) => {
      console.log(`${index + 1}. ${agent.fullName}`);
    });
    
    // Test JSON serialization
    const jsonAgents = JSON.stringify(agents);
    console.log('JSON length:', jsonAgents.length);
    
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
  });
