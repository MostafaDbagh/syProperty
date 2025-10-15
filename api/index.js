const express = require('express');
const dotenv = require('dotenv');
const db = require('./db/connect');
const cors = require('cors');
const cookieParser = require('cookie-parser');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Test routes one by one
try {
  console.log('Testing auth router...');
  const authRouter = require('./routes/auth.route');
  app.use('/api/auth', authRouter);
  console.log('Auth router OK');
  
  console.log('Testing user router...');
  const userRouter = require('./routes/user.route');
  app.use('/api/user', userRouter);
  console.log('User router OK');
  
  console.log('Testing listing router...');
  const listingRouter = require('./routes/listing.route');
  app.use('/api/listing', listingRouter);
  console.log('Listing router OK');
  
  console.log('Testing review router...');
  const reviewRouter = require('./routes/review.route');
  app.use('/api/review', reviewRouter);
  console.log('Review router OK');
  
  console.log('Testing contact router...');
  const contactRoutes = require('./routes/contact.route');
  app.use('/api/contacts', contactRoutes);
  console.log('Contact router OK');
  
  console.log('Testing favorite router...');
  const favoriteRoutes = require('./routes/favorite.route');
  app.use('/api/favorites', favoriteRoutes);
  console.log('Favorite router OK');
  
  console.log('Testing agent router...');
  const agentRoutes = require('./routes/agent.routes');
  app.use('/api/agents', agentRoutes);
  console.log('Agent router OK');
  
  console.log('Testing point router...');
  const pointRoutes = require('./routes/point.route');
  app.use('/api/points', pointRoutes);
  console.log('Point router OK');
  
  console.log('Testing message router...');
  const messageRoutes = require('./routes/message.route');
  app.use('/api/message', messageRoutes);
  console.log('Message router OK');
  
  console.log('Testing newsletter router...');
  const newsletterRoutes = require('./routes/newsletter.route');
  app.use('/api/newsletter', newsletterRoutes);
  console.log('Newsletter router OK');
  
  console.log('Testing blog router...');
  const blogRoutes = require('./routes/blog.route');
  app.use('/api/blog', blogRoutes);
  console.log('Blog router OK');
  
  console.log('Testing dashboard router...');
  const dashboardRoutes = require('./routes/dashboard.route');
  app.use('/api/dashboard', dashboardRoutes);
  console.log('Dashboard router OK');
  
  app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'All routes loaded successfully' });
  });
  
  const PORT = process.env.PORT || 5500;
  
  app.listen(PORT, () => {
    console.log(`All routes test running on port ${PORT}`);
  });
  
} catch (e) {
  console.error('Error loading routes:', e.message);
  console.error('Stack:', e.stack);
}

// Test routes one by one
try {
  console.log('Testing auth router...');
  const authRouter = require('./routes/auth.route');
  app.use('/api/auth', authRouter);
  console.log('Auth router OK');
  
  console.log('Testing user router...');
  const userRouter = require('./routes/user.route');
  app.use('/api/user', userRouter);
  console.log('User router OK');
  
  console.log('Testing listing router...');
  const listingRouter = require('./routes/listing.route');
  app.use('/api/listing', listingRouter);
  console.log('Listing router OK');
  
  console.log('Testing review router...');
  const reviewRouter = require('./routes/review.route');
  app.use('/api/review', reviewRouter);
  console.log('Review router OK');
  
  console.log('Testing contact router...');
  const contactRoutes = require('./routes/contact.route');
  app.use('/api/contacts', contactRoutes);
  console.log('Contact router OK');
  
  console.log('Testing favorite router...');
  const favoriteRoutes = require('./routes/favorite.route');
  app.use('/api/favorites', favoriteRoutes);
  console.log('Favorite router OK');
  
  console.log('Testing agent router...');
  const agentRoutes = require('./routes/agent.routes');
  app.use('/api/agents', agentRoutes);
  console.log('Agent router OK');
  
  console.log('Testing point router...');
  const pointRoutes = require('./routes/point.route');
  app.use('/api/points', pointRoutes);
  console.log('Point router OK');
  
  console.log('Testing message router...');
  const messageRoutes = require('./routes/message.route');
  app.use('/api/message', messageRoutes);
  console.log('Message router OK');
  
  console.log('Testing newsletter router...');
  const newsletterRoutes = require('./routes/newsletter.route');
  app.use('/api/newsletter', newsletterRoutes);
  console.log('Newsletter router OK');
  
  console.log('Testing blog router...');
  const blogRoutes = require('./routes/blog.route');
  app.use('/api/blog', blogRoutes);
  console.log('Blog router OK');
  
  console.log('Testing dashboard router...');
  const dashboardRoutes = require('./routes/dashboard.route');
  app.use('/api/dashboard', dashboardRoutes);
  console.log('Dashboard router OK');
  
  app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'All routes loaded successfully' });
  });
  
  const PORT = process.env.PORT || 5500;
  
  app.listen(PORT, () => {
    console.log(`All routes test running on port ${PORT}`);
  });
  
} catch (e) {
  console.error('Error loading routes:', e.message);
  console.error('Stack:', e.stack);
}
