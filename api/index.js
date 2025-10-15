const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const path = require('path');
const db = require('./db/connect');
const cors = require('cors')
const authRouter = require('./routes/auth.route');
const userRouter = require('./routes/user.route');
const listingRouter = require('./routes/listing.route');
const reviewRouter = require('./routes/review.route');
const contactRoutes = require('./routes/contact.route')
const favoriteRoutes = require('./routes/favorite.route');
const agentRoutes = require('./routes/agent.routes');
const pointRoutes = require('./routes/point.route');
const messageRoutes = require('./routes/message.route');
const newsletterRoutes = require('./routes/newsletter.route');
const blogRoutes = require('./routes/blog.route');
const dashboardRoutes = require('./routes/dashboard.route');

// Security middleware
const { 
  setupSecurity, 
  securityLogger, 
  sanitizeTextInput 
} = require('./middleware/security');

dotenv.config();

const app = express();

// Apply security middleware first
setupSecurity(app);
app.use(securityLogger);
app.use(sanitizeTextInput);

// Trust proxy for accurate IP addresses (important for rate limiting)
app.set('trust proxy', 1);

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/listing', listingRouter);
app.use('/api/review',reviewRouter)
app.use('/api/contacts', contactRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/points', pointRoutes);
app.use('/api/message', messageRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/dashboard', dashboardRoutes);




// Optional: Serve frontend if you're deploying full-stack together
// app.use(express.static(path.join(__dirname, '/proty-nextjs/dist')));
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'proty-nextjs', 'dist', 'index.html'));
// });

const PORT = process.env.PORT || 5500;

app.listen(PORT, () => {
  // Server started successfully
});
