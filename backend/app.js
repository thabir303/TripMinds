const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const textRoutes = require('./routes/textRoutes');
const metaRoutes = require('./routes/metaRoutes');
const hotelRoutes = require('./routes/hotelRoutes');
const transportRoutes = require('./routes/transportRoutes');
const itineraryRoutes = require('./routes/itineraryRoutes');
const captions = require('./routes/captions');
// Load environment variables
dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
}));
app.use(express.json()); // Parse incoming JSON bodies

// Routes
app.use('/api/auth', authRoutes);  // Authentication routes
app.use('/api', textRoutes);       // Store/Retrieve text routes
app.use('/api/meta', metaRoutes);
app.use('/api/hotel', hotelRoutes);
app.use('/api/transport', transportRoutes);
app.use('/api/itinerary', itineraryRoutes);
app.use('/api/captions',captions);

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Express server running on port ${PORT}`);
});
