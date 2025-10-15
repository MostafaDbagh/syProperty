const mongoose = require('mongoose');

const mongoURI = process.env.MONGO_URI || 'mongodb+srv://safi:35064612@cluster0-ags3s.mongodb.net/SyProperties?retryWrites=true&w=majority';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
})

const conn = mongoose.connection;
conn.on('connected',()=>{
    console.log('you are connecting to database') 
})
conn.on('error',(err)=>{
    console.log('connection failed to database',err.message)
})

module.exports = conn