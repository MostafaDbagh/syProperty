const mongoose = require('mongoose');
const Agent = require('./models/agent.model');

mongoose.connect('mongodb://localhost:27017/syProperty')
  .then(async () => {
    console.log('✅ MongoDB Connected');
    
    // Test the exact same query as the controller
    const agents = await Agent.find();
    console.log('Agents found:', agents.length);
    
    // Test JSON serialization
    const jsonResponse = JSON.stringify(agents);
    console.log('JSON response length:', jsonResponse.length);
    
    // Test individual agent serialization
    agents.forEach((agent, index) => {
      const agentJson = JSON.stringify(agent);
      console.log(`Agent ${index + 1}: ${agent.fullName} - JSON length: ${agentJson.length}`);
    });
    
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
  });
