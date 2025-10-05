const Agent = require('../models/agent.model');
const { errorHandler } = require('../utils/error');

// Create agent
const createAgent = async (req, res, next) => {
    try {
      const {
        fullName,
        description,
        companyName,
        position,
        officeNumber,
        officeAddress,
        job,
        email,
        phone,
        location,
        facebook,
        twitter,
        linkedin,
        avatar,
        poster, 
      } = req.body;
  

      const newAgent = new Agent({
        fullName,
        description,
        companyName,
        position,
        officeNumber,
        officeAddress,
        job,
        email,
        phone,
        location,
        facebook,
        twitter,
        linkedin,
        avatar, 
        poster, 
      });
  
      const savedAgent = await newAgent.save();
  
      res.status(201).json(savedAgent);
    } catch (error) {
      next(error);
    }
  };
  

// Get all agents
const getAgents = async (req, res, next) => {
  try {
    const agents = await Agent.find();
    res.status(200).json(agents);
  } catch (error) {
    next(error);
  }
};

// Get single agent
const getAgentById = async (req, res, next) => {
  try {
    const agent = await Agent.findById(req.params.id);
    if (!agent) return next(errorHandler(404, 'Agent not found'));
    res.status(200).json(agent);
  } catch (error) {
    next(error);
  }
};

// Update agent
const updateAgent = async (req, res, next) => {
  try {
    const updated = await Agent.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

// Delete agent
const deleteAgent = async (req, res, next) => {
  try {
    await Agent.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Agent deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAgent,
  getAgents,
  getAgentById,
  updateAgent,
  deleteAgent
};
