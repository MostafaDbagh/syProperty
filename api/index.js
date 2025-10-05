const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const path = require('path');
const db = require('./db/connect');
const cors = require('cors')
const authRouter = require('./routes/auth.route');
const listingRouter = require('./routes/listing.route');
const reviewRouter = require('./routes/review.route');
const contactRoutes = require('./routes/contact.route')
const favoriteRoutes = require('./routes/favorite.route');
const agentRoutes = require('./routes/agent.routes');
const pointRoutes = require('./routes/point.route');


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);
app.use('/api/review',reviewRouter)
app.use('/api/contacts', contactRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/points', pointRoutes);




// Optional: Serve frontend if you're deploying full-stack together
// app.use(express.static(path.join(__dirname, '/proty-nextjs/dist')));
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'proty-nextjs', 'dist', 'index.html'));
// });

const PORT = process.env.PORT || 5500;

app.listen(PORT, () => console.log('We are listening to the port ' + PORT));
