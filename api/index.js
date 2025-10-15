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

// Routes
const authRouter = require('./routes/auth.route');
const userRouter = require('./routes/user.route');
const listingRouter = require('./routes/listing.route');
const reviewRouter = require('./routes/review.route');
const contactRoutes = require('./routes/contact.route');
const favoriteRoutes = require('./routes/favorite.route');
const agentRoutes = require('./routes/agent.routes');
const pointRoutes = require('./routes/point.route');
const messageRoutes = require('./routes/message.route');
const newsletterRoutes = require('./routes/newsletter.route');
const blogRoutes = require('./routes/blog.route');
const dashboardRoutes = require('./routes/dashboard.route');

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/listing', listingRouter);
app.use('/api/review', reviewRouter);
app.use('/api/contacts', contactRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/points', pointRoutes);
app.use('/api/message', messageRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'All routes loaded successfully' });
});

const PORT = process.env.PORT || 5500;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
